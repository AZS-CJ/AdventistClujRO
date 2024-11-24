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
    ipweb  = string
  }))
  default = {
    azsplatform = {
      name   = "azsplatform"
      domain = "azsplatform.ro"
      ipweb = "51.116.145.35"
    }
    adventistcluj = {
      name   = "adventistcluj"
      domain = "adventistcluj.ro"
      ipweb = "51.116.145.35"
    }
    brasovadventist = {
      name   = "brasovadventist"
      domain = "brasovadventist.ro"
      ipweb = "51.116.145.35"
    }
  }
}

variable "sites-verifications" {
  type = map(object({
    name   = string
    domain = string
    ipweb  = string
  }))
  default = {
    azsplatform = {
      name   = "azsplatform"
      domain = "azsplatform.ro"
      ipweb = "51.116.145.35"
    }
    # adventistcluj = {
    #   name   = "adventistcluj"
    #   domain = "adventistcluj.ro"
    #   ipweb = "51.116.145.35"
    # }
    brasovadventist = {
      name   = "brasovadventist"
      domain = "brasovadventist.ro"
      ipweb = "51.116.145.35"
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
