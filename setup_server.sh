#!/usr/bin/env bash

# ============================
# 1) تحديث النظام
# ============================
sudo apt update && sudo apt upgrade -y

# ============================
# 2) تثبيت Nginx + Certbot
# ============================
sudo apt install nginx python3 python3-venv python3-pip python3-certbot-nginx -y

# ============================
# 3) إنشاء مشروع السيرفر
# ============================
mkdir -p ~/docserver
cd ~/docserver

python3 -m venv venv
source venv/bin/activate

pip install flask

# ============================
# 4) إنشاء تطبيق Flask بسيط
# ============================
cat << 'EOF' > app.py
from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
    return "🚀 السيرفر شغّال بنجاح"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
EOF

# ============================
# 5) إعداد Nginx كـ Reverse Proxy
# ============================
sudo bash -c 'cat << "EOF" > /etc/nginx/sites-available/docserver
server {
    listen 80;
    server_name YOURDOMAIN.COM;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF'

sudo ln -sf /etc/nginx/sites-available/docserver /etc/nginx/sites-enabled/docserver
sudo nginx -t && sudo systemctl restart nginx

# ============================
# 6) تشغيل السيرفر
# ============================
nohup ./venv/bin/python app.py &

echo "🔥 السيرفر شغّال على http://YOURDOMAIN.COM"
echo "🔥 جاهز للحصول على SSL"
@app.route("/info")
def info():
    return "السيرفر شغّال – وكل حاجة تمام 🔥"
