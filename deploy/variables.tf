variable "website_name" {
  type    = string
  default = "adventistclujro"
}

variable "environments" {
  default = {
    "test" = 1
    "prod" = 1
  }
}