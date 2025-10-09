from m5stack import *
from m5ui import *
from uiflow import *
from m5mqtt import M5mqtt
from libs.json_py import *
import unit


setScreenColor(0x111111)
qrcode_0 = unit.get(unit.QRCODE, unit.PAHUB1)
qrcode_1 = unit.get(unit.QRCODE, unit.PAHUB2)
qrcode_2 = unit.get(unit.QRCODE, unit.PAHUB3)
qrcode_3 = unit.get(unit.QRCODE, unit.PAHUB4)


cart_empty = None
lastQR1 = None
lastQR2 = None
Station1Trigger = None
Station2Trigger = None
Station1QR = None
Station2QR = None


label0 = M5TextBox(0, 0, "POST REQ", lcd.FONT_DejaVu18, 0xFFFFFF, rotate=0)


m5mqtt = M5mqtt('shahar', 'test.mosquitto.org', 1883, '', '', 300)
m5mqtt.start()
qrcode_0.init_device_mode(0, 0x21)
qrcode_0.set_trigger_mode(0)
qrcode_1.init_device_mode(0, 0x21)
qrcode_1.set_trigger_mode(0)
EMPTY_STATION_CART_ID = 'cart_empty'
lastQR1 = EMPTY_STATION_CART_ID
lastQR2 = EMPTY_STATION_CART_ID
QR1_id = 1
QR2_id = 2


def sendMessage(station_id, old_cart_id, current_cart_id):
  label0.setText('publish MQTT Message..')
  m5mqtt.publish(str('braude/D106/prodLine/qr'), str((py_2_json({'current_cart_id':current_cart_id,'old_cart_id':old_cart_id,'station_id':int(station_id)}))), 0)
     
      
while True:
  Station1Trigger = qrcode_0.get_qrcode_data_status()
  Station2Trigger = qrcode_1.get_qrcode_data_status()
  if Station1Trigger != 0:
    Station1QR = qrcode_0.get_qrcode_data(True)
    if Station1QR != lastQR1:
      label0.setText('publish MQTT Message..')
      sendMessage(QR1_id, lastQR1, Station1QR)
      lastQR1 = Station1QR
      if lastQR1 == lastQR2:
        sendMessage(QR2_id, lastQR2, EMPTY_STATION_CART_ID)
        lastQR2 = EMPTY_STATION_CART_ID
  if Station2Trigger != 0:
    Station2QR = qrcode_1.get_qrcode_data(True)
    if Station2QR != lastQR2:
      label0.setText('publish MQTT Message..')
      sendMessage(QR2_id, lastQR2, Station2QR)
      lastQR2 = Station2QR
      if lastQR2 == lastQR1:
        sendMessage(QR1_id, lastQR1, EMPTY_STATION_CART_ID)
        lastQR1 = EMPTY_STATION_CART_ID
  wait_ms(2)