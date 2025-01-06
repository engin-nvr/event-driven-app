#!/bin/bash
# Sistem güncellemelerini yapıyoruz
apt-get update -y
apt-get upgrade -y

# Git ve Docker'ı yüklüyoruz
apt-get install -y git
apt-get install -y docker.io

# Docker servisini başlatıyoruz ve otomatik başlatmayı etkinleştiriyoruz
systemctl start docker
systemctl enable docker

# ec2-user'ı Docker grubuna ekliyoruz
usermod -aG docker $(whoami)

# Docker komutlarını kullanabilmek için yeni grup ayarlarını uyguluyoruz
newgrp docker

# Docker Compose'u indirip kuruyoruz
curl -SL https://github.com/docker/compose/releases/download/v2.32.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Çalışma dizinine git
cd /home/ubuntu

# Public repo'yu GitHub'dan klonluyoruz
USER=${user_data_git_name}
git clone https://github.com/$USER/event-driven-app.git

# Uygulama dizinine gidiyoruz
cd /home/ubuntu/event-driven-app

# Docker Compose ile container'ı başlatıyoruz
docker-compose up -d