# AWS region değişkeni
variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

# AWS Access Key değişkeni
variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
}

# AWS Secret Key değişkeni
variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
}

# AWS SSH Key Name değişkeni
variable "aws_key_name" {
  description = "AWS SSH Key Name"
  type        = string
}


# VPC ID değişkeni
variable "vpc_id" {
  description = "VPC ID where the resources will be created"
  type        = string
}

# github username
variable "git_name" {
  description = "GitHub kullanıcı adı"
  type        = string
}
