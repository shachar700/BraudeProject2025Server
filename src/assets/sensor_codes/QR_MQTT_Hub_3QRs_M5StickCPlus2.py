from m5stack import *
from m5ui import *
from uiflow import *
from m5mqtt import M5mqtt
from libs.json_py import *
import unit

setScreenColor(0x111111)

# QR Units via PaHUB Splitter
qrcode_0 = unit.get(unit.QRCODE, unit.PAHUB1)
qrcode_1 = unit.get(unit.QRCODE, unit.PAHUB2)
qrcode_2 = unit.get(unit.QRCODE, unit.PAHUB3)

label0 = M5TextBox(0, 0, "POST REQ", lcd.FONT_DejaVu18, 0xFFFFFF, rotate=0)

# MQTT
m5mqtt = M5mqtt('shahar', 'test.mosquitto.org', 1883, '', '', 300)
m5mqtt.start()

qrcodes = [qrcode_0, qrcode_1, qrcode_2]
qr_ids  = [1, 2, 3]
EMPTY_STATION_CART_ID = "cart_empty"
lastQR  = [EMPTY_STATION_CART_ID] * len(qrcodes)

# Init QR units
for qr in qrcodes:
    qr.init_device_mode(0, 0x21)
    qr.set_trigger_mode(0)


# MQTT send function
def sendMessage(station_id, old_cart_id, current_cart_id):
    label0.setText('publish MQTT Message..')
    payload = py_2_json({
        'current_cart_id': current_cart_id,
        'old_cart_id': old_cart_id,
        'station_id': int(station_id)
    })
    m5mqtt.publish('braude/D106/prodLine/qr', payload, 0)


while True:

    for i in range(len(qrcodes)):
        trigger = qrcodes[i].get_qrcode_data_status()

        if trigger != 0:
            scannedQR = qrcodes[i].get_qrcode_data(True)

            # Something changed?
            if scannedQR != lastQR[i]:
                sendMessage(qr_ids[i], lastQR[i], scannedQR)
                lastQR[i] = scannedQR

                # Clear duplicates on other stations
                for j in range(len(qrcodes)):
                    if j != i and lastQR[j] == scannedQR:
                        sendMessage(qr_ids[j], lastQR[j], EMPTY_STATION_CART_ID)
                        lastQR[j] = EMPTY_STATION_CART_ID

    wait_ms(10)