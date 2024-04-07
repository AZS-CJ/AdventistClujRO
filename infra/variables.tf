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

variable "sites" {
  type = map(object({
    name       = string
    domain     = string
  }))
  default = {
    azsplatform = {
      name       = "azsplatform"
      domain     = "azsplatform.ro"
    }
    adventistcluj = {
      name       = "adventistcluj"
      domain     = "adventistcluj.ro"
    }
  }
}

variable "EMAIL_ADDRESS_TEST" {
  type    = string
  default = ""
}

variable "EMAIL_PASSWORD_TEST" {
  type    = string
  default = ""
}

variable "EMAIL_ADDRESS_PROD" {
  type    = string
  default = ""
}

variable "EMAIL_PASSWORD_PROD" {
  type    = string
  default = ""
}
