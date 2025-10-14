from m5stack import *
from m5ui import *
from uiflow import *
import imu
import time
import math
from m5mqtt import M5mqtt

cart_id = "cart_1"
show_labels = True

setScreenColor(0x000000)

ax, ay, vx, vy = 0.0, 0.0, 0.0, 0.0
alpha = 0.98 #small damping factor to limit drift

imu0 = imu.IMU()
prev_time = time.ticks_ms()

if show_labels:
    imu_script_label = M5TextBox(20, 20, "imu script", lcd.FONT_Default, 0xFFFFFF, rotate=0)
    cart_id_label = M5TextBox(20, 40, cart_id, lcd.FONT_Default, 0xFFFFFF, rotate=0)
    
    ax_label = M5TextBox(20, 70, "ax", lcd.FONT_Default, 0xFFFFFF, rotate=0)
    ay_label = M5TextBox(20, 100, "ay", lcd.FONT_Default, 0xFFFFFF, rotate=0)
    vx_label = M5TextBox(20, 140, "vx", lcd.FONT_Default, 0xFFFFFF, rotate=0)
    vy_label = M5TextBox(20, 170, "vy", lcd.FONT_Default, 0xFFFFFF, rotate=0)
    speed_label = M5TextBox(20, 200, "speed", lcd.FONT_Default, 0xFFFFFF, rotate=0)

m5mqtt = M5mqtt('shahar', 'test.mosquitto.org', 1883, '', '', 300)
m5mqtt.start()

while True:
  ax = imu0.acceleration[0]
  ay = imu0.acceleration[1]
  
  now = time.ticks_ms()
  dt = (time.ticks_diff(now, prev_time)) / 1000.0
  prev_time = now
  
  vx = alpha * (vx + ax * dt)
  vy = alpha * (vy + ay * dt)
  
  speed = math.sqrt(vx * vx + vy * vy)
  
  if show_labels:
      ax_label.setText("ax: {:.2f}".format(ax))
      ay_label.setText("ay: {:.2f}".format(ay))
      vx_label.setText("vx: {:.2f}".format(vx))
      vy_label.setText("vy: {:.2f}".format(vy))
      speed_label.setText("speed: {:.2f}".format(speed))
  
  m5mqtt.publish('braude/D106/prodLine/imu', py_2_json({'cart_id': cart_id, 'speed': round(speed, 3)}), 0)
  
  wait_ms(10)
