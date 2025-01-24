variable "website_name" {
  type    = string
  default = "adventistclujro"
}

variable "yt_api_key" {
  type = string
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
