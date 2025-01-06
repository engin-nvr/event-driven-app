# AWS provider'ı tanımlıyoruz
provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# EC2 instance kaynak tanımı
resource "aws_instance" "nodejs_instance" {
  ami           = "ami-0e2c8caa4b6378d8c" # Ubuntu 20.04 AMI ID
  instance_type = "t2.micro"              # Küçük bir instance tipi
  key_name      = var.aws_key_name       # SSH key ismi

  # Instance başlatıldığında çalışacak user_data scripti
  user_data = templatefile("my-template.sh", { user_data_git_name = var.git_name })

  # Güvenlik grubunun ID'si ile ilişkilendiriyoruz
  vpc_security_group_ids = [aws_security_group.nodejs_sg.id]

  # Instance tagleri
  tags = {
    Name = "NodeJSInstance"
  }
}

# Güvenlik grubu kaynağı
resource "aws_security_group" "nodejs_sg" {
  name        = "nodejs-security-group"
  description = "Allow HTTP, HTTPS, and SSH traffic"
  vpc_id      = var.vpc_id  # VPC ID'yi değişken olarak alıyoruz

  # SSH erişimi için 22. portu açıyoruz
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Güvenli bir CIDR bloğu belirtin
  }

  # HTTP trafiği için 80. portu açıyoruz
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Web erişimi için tüm IP'lere izin ver
  }

  # HTTPS trafiği için 443. portu açıyoruz
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Web erişimi için tüm IP'lere izin ver
  }
  # Kafka Broker için 9092. portu açıyoruz
  ingress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Tüm IP'lere izin ver
  }

  # Kafka Controller için 9093. portu açıyoruz
  ingress {
    from_port   = 9093
    to_port     = 9093
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Tüm IP'lere izin ver
  }

  # MongoDB için 27017. portu açıyoruz
  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Tüm IP'lere izin ver
  }

  # API için 3000. portu açıyoruz
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Tüm IP'lere izin ver
  }

  # Outbound (giden) trafik için herhangi bir kısıtlama yok
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]  # Tüm dış ağlara giden trafik serbest
  }

  tags = {
    Name = "NodeJS-Security-Group"
  }
}

