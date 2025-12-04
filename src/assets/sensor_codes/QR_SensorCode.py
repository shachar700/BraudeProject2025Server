from m5stack import *
from m5ui import *
from uiflow import *
from m5mqtt import M5mqtt
from libs.json_py import *
import unit

setScreenColor(0x111111)

### ---- CONFIG ----
SHOW_LABELS = True   # Toggle to show/hide labels
EMPTY_STATION_CART_ID = "cart_empty"

station_names = [
    "Station 1",
    "Station 2",
    "Station 3",
    "Station 4"
]

### ---- UI SETUP ----
screen = M5Screen()
screen.clean_screen()
screen.set_screen_bg_color(0xffffff)

battery_label = M5Label('Battery:', x=10, y=10, color=0x000000, font=FONT_MONT_22)

# Create aligned station labels
station_labels = []
y_offset = 60

for name in station_names:
    lbl = M5Label(f"{name}: Cart ---", x=10, y=y_offset, color=0x000000, font=FONT_MONT_22)
    station_labels.append(lbl)
    y_offset += 35

# Status label (bottom)
update_label = M5TextBox(0, 220, "Waiting...", lcd.FONT_DejaVu18, 0x000000, rotate=0)

# Apply visibility toggle
if not SHOW_LABELS:
    battery_label.hide()
    for lbl in station_labels:
        lbl.hide()

### ---- QR Units via PaHUB ----
qrcode_0 = unit.get(unit.QRCODE, unit.PAHUB1)
qrcode_1 = unit.get(unit.QRCODE, unit.PAHUB2)
qrcode_2 = unit.get(unit.QRCODE, unit.PAHUB3)
qrcode_3 = unit.get(unit.QRCODE, unit.PAHUB4)

qrcodes = [qrcode_0, qrcode_1, qrcode_2, qrcode_3]
qr_ids  = [1, 2, 3, 4]
lastQR  = [EMPTY_STATION_CART_ID] * len(qrcodes)

### ---- MQTT ----
m5mqtt = M5mqtt('shahar', 'test.mosquitto.org', 1883, '', '', 300)
m5mqtt.start()

# Configure all scanners
for qr in qrcodes:
    qr.init_device_mode(0, 0x21)
    qr.set_trigger_mode(0)

### ---- Helper Functions ----

def updateStationLabel(station_id, cart_id):
    """Updates label text for each station when a cart arrives or leaves."""
    index = station_id - 1
    text = f"{station_names[index]}: Cart {cart_id if cart_id != EMPTY_STATION_CART_ID else '---'}"
    station_labels[index].setText(text)


def sendMessage(station_id, old_cart_id, current_cart_id):
    """Publishes MQTT message and updates UI feedback."""
    update_label.setText("Sending...")

    payload = py_2_json({
        'station_id': int(station_id),
        'old_cart_id': old_cart_id,
        'current_cart_id': current_cart_id
    })

    m5mqtt.publish('braude/D106/prodLine/qr', payload, 0)

    update_label.setText("Update Sent.")
    wait_ms(700)
    update_label.setText("Waiting...")


### ---- MAIN LOOP ----
while True:

    for i in range(len(qrcodes)):
        trigger = qrcodes[i].get_qrcode_data_status()

        if trigger != 0:
            scannedQR = qrcodes[i].get_qrcode_data(True)

            # Check if cart changed
            if scannedQR != lastQR[i]:
                sendMessage(qr_ids[i], lastQR[i], scannedQR)
                lastQR[i] = scannedQR
                updateStationLabel(qr_ids[i], scannedQR)

                # Remove duplicates from other stations
                for j in range(len(qrcodes)):
                    if j != i and lastQR[j] == scannedQR:
                        sendMessage(qr_ids[j], scannedQR, EMPTY_STATION_CART_ID)
                        lastQR[j] = EMPTY_STATION_CART_ID
                        updateStationLabel(qr_ids[j], EMPTY_STATION_CART_ID)

    wait_ms(5)