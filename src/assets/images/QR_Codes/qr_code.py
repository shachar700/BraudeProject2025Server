# pip install qrcode
import qrcode

# Simple generation
img = qrcode.make(f'cart_empty')
img.save(f'cart_empty.png')
for i in range(1,9,1):
    img = qrcode.make(f'cart_{i}')
    img.save(f'cart_{i}.png')

print("QR code saved as simple_qr.png")