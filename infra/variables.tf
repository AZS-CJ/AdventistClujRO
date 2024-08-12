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

variable "only_platform_enabled" {
  type    = bool
  default = true
}

variable "sites" {
  type = map(object({
    name   = string
    domain = string
  }))
  default = {
    azsplatform = {
      name   = "azsplatform"
      domain = "azsplatform.ro"
      enable = true
    }
    adventistcluj = {
      name   = "adventistcluj"
      domain = "adventistcluj.ro"
      enable = false
    }
    brasovadventist = {
      name   = "brasovadventist"
      domain = "brasovadventist.ro"
      enable = true
    }
  }
}

variable "only_platform" {
  type = map(object({
    name   = string
    domain = string
  }))
  default = {
    azsplatform = {
      name   = "azsplatform"
      domain = "azsplatform.ro"
      enable = true
    }
    brasovadventist = {
      name   = "brasovadventist"
      domain = "brasovadventist.ro"
      enable = true
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
