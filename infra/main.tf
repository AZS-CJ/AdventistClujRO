terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state"
    storage_account_name = "adventistclujstorage"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.33.0"
    }
  }
}

provider "azurerm" {
  features {}
}

// Common infrastructure
resource "azurerm_resource_group" "common" {
  name     = "common-rg"
  location = "Germany West Central"
}

resource "azurerm_container_registry" "acr" {
  name                = "azscjacr"
  resource_group_name = azurerm_resource_group.common.name
  location            = azurerm_resource_group.common.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_resource_group" "website" {
  for_each = var.environments
  name     = "${var.website_name}-${each.key}-rg"
  location = "Germany West Central"
}

// Common database
resource "random_password" "admin-login-pass" {
  length  = 32
  special = true
}

resource "azurerm_mysql_flexible_server" "cms-db" {
  name                   = "cms-db"
  resource_group_name    = azurerm_resource_group.common.name
  location               = azurerm_resource_group.common.location
  administrator_login    = "mysqladminuser"
  administrator_password = random_password.admin-login-pass.result
  backup_retention_days  = 7
  sku_name               = "B_Standard_B1s"
  version                = "8.0.21"
}

# Not yet available in the Azure provider, has to be done manually
# after it's created by terraform
# resource "azurerm_mysql_firewall_rule" "AllAccessRule" {
#   name                = "AllAccessRule"
#   resource_group_name = azurerm_resource_group.common.name
#   server_name         = azurerm_mysql_flexible_server.cms-db.name
#   start_ip_address    = "0.0.0.0"
#   end_ip_address      = "255.255.255.255"
# }

// Website specific resources
resource "azurerm_application_insights" "AZSClujAppInisghts" {
  for_each            = var.environments
  name                = "aiazscj-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  application_type    = "Node.JS"
}

resource "azurerm_service_plan" "web-sites-service-plan" {
  name                = "${var.website_name}-ServicePlan"
  location            = azurerm_resource_group.common.location
  resource_group_name = azurerm_resource_group.common.name

  os_type     = "Linux"
  sku_name    = "B1"
}

resource "azurerm_linux_web_app" "webhost" {
  for_each            = var.environments
  name                = "${var.website_name}-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  service_plan_id = azurerm_service_plan.web-sites-service-plan.id
  https_only          = true

  site_config {
    application_stack {
      node_version = "16-lts"
    }
    use_32_bit_worker = false
  }

  app_settings = {
    "CMS_DB_HOST"   = "https://${azurerm_linux_web_app.strapi[each.key].default_hostname}"
    "EMAIL_ADDRESS" = each.key == "test" ? var.EMAIL_ADDRESS_TEST : var.EMAIL_ADDRESS_PROD
    "EMAIL_PASSWORD" = each.key == "test" ? var.EMAIL_PASSWORD_TEST : var.EMAIL_PASSWORD_PROD
  }

  connection_string {
    name  = "Database"
    type  = "Custom"
    value = "NoConnectionStringNeededYet"
  }

  identity {
    type = "SystemAssigned"
  }

  logs {
    application_logs {
      file_system_level = "Information"
    }

    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb = 35
      }
    }
  }
}

resource "random_password" "strapi-admin-jwt-secret" {
  for_each            = var.environments
  length = 32
  special = false
}

resource "random_password" "strapi-jwt-secret" {
  for_each            = var.environments
  length = 32
  special = false
}

resource "random_password" "strapi-app-key1" {
  for_each            = var.environments
  length = 16
  special = true
}

resource "random_password" "strapi-app-key2" {
  for_each            = var.environments
  length = 16
  special = true
}

resource "random_password" "strapi-app-key3" {
  for_each            = var.environments
  length = 16
  special = true
}

resource "random_password" "strapi-app-key4" {
  for_each            = var.environments
  length = 16
  special = true
}

resource "random_password" "api-token-salt" {
  for_each            = var.environments
  length = 16
  special = true
}

// Strapi
resource "azurerm_linux_web_app" "strapi" {
  for_each            = var.environments
  name                = "${var.website_name}-strapi-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  service_plan_id = azurerm_service_plan.web-sites-service-plan.id
  https_only          = true

  site_config {
    application_stack {
      docker_image = "azscjacr.azurecr.io/azscjstrapi"
      docker_image_tag = "latest"
    }
    use_32_bit_worker = false
  }

  app_settings = {
    "DATABASE_CLIENT"   = "mysql"
    "DATABASE_HOST"     = azurerm_mysql_flexible_server.cms-db.fqdn
    "DATABASE_PORT"     = "3306"
    "DATABASE_NAME"     = "cms-db-${each.key}"
    "DATABASE_USERNAME" = "mysqladminuser"
    "DATABASE_PASSWORD" = random_password.admin-login-pass.result
    "ADMIN_JWT_SECRET"  = base64encode(random_password.strapi-admin-jwt-secret[each.key].result)
    "JWT_SECRET"        = base64encode(random_password.strapi-jwt-secret[each.key].result)
    "APP_KEYS"          = "${base64encode(random_password.strapi-app-key1[each.key].result)},${base64encode(random_password.strapi-app-key2[each.key].result)},${base64encode(random_password.strapi-app-key3[each.key].result)},${base64encode(random_password.strapi-app-key4[each.key].result)}"
    "API_TOKEN_SALT"    = base64encode(random_password.api-token-salt[each.key].result)
  }

  identity {
    type = "SystemAssigned"
  }

  logs {
    application_logs {
      file_system_level = "Information"
    }

    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb = 35
      }
    }
  }
}

resource "azurerm_app_service_custom_hostname_binding" "hostname_binding" {
  hostname            = "adventistcluj.ro"
  app_service_name    = azurerm_linux_web_app.webhost["prod"].name
  resource_group_name = azurerm_resource_group.website["prod"].name
}

resource "azurerm_app_service_custom_hostname_binding" "www_hostname_binding" {
  hostname            = "www.adventistcluj.ro"
  app_service_name    = azurerm_linux_web_app.webhost["prod"].name
  resource_group_name = azurerm_resource_group.website["prod"].name
}

resource "azurerm_app_service_custom_hostname_binding" "test_hostname_binding" {
  hostname            = "test.adventistcluj.ro"
  app_service_name    = azurerm_linux_web_app.webhost["test"].name
  resource_group_name = azurerm_resource_group.website["test"].name
}

resource "azurerm_app_service_custom_hostname_binding" "strapi_hostname_binding" {
  hostname            = "cms.adventistcluj.ro"
  app_service_name    = azurerm_linux_web_app.strapi["prod"].name
  resource_group_name = azurerm_resource_group.website["prod"].name
}

resource "azurerm_app_service_custom_hostname_binding" "strapi_test_hostname_binding" {
  hostname            = "cms-test.adventistcluj.ro"
  app_service_name    = azurerm_linux_web_app.strapi["test"].name
  resource_group_name = azurerm_resource_group.website["test"].name
}

resource "azurerm_role_assignment" "acr" {
  for_each             = var.environments
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = azurerm_linux_web_app.strapi[each.key].identity[0].principal_id
}

resource "azurerm_dns_zone" "azscj-zone" {
  name                = "adventistcluj.ro"
  resource_group_name = azurerm_resource_group.common.name
}

resource "azurerm_dns_a_record" "adventistclujro-prod-naked" {
  name                = "@"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  records             = ["51.116.145.35"] // this has to be added manually as the app service resource doesn't output the ip in terraform
}

resource "azurerm_dns_txt_record" "adventistclujro-prod-naked-verif" {
  name                = "asuid"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  
  record {
    value = azurerm_linux_web_app.webhost["prod"].custom_domain_verification_id
  }
}

resource "azurerm_dns_cname_record" "adventistclujro-prod-www" {
  name                = "www"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  record              = azurerm_linux_web_app.webhost["prod"].default_hostname
}

resource "azurerm_dns_txt_record" "adventistclujro-prod-www-verif" {
  name                = "asuid.www"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  
  record {
    value = azurerm_linux_web_app.webhost["prod"].custom_domain_verification_id
  }
}

resource "azurerm_dns_cname_record" "adventistclujro-test" {
  name                = "test"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  record              = azurerm_linux_web_app.webhost["test"].default_hostname
}

resource "azurerm_dns_txt_record" "adventistclujro-prod-test-verif" {
  name                = "asuid.test"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  
  record {
    value = azurerm_linux_web_app.webhost["test"].custom_domain_verification_id
  }
}

resource "azurerm_dns_cname_record" "adventistclujro-prod-cms" {
  name                = "cms"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  record              = azurerm_linux_web_app.strapi["prod"].default_hostname
}

resource "azurerm_dns_txt_record" "adventistclujro-prod-cms-verify" {
  name                = "asuid.cms"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  
  record {
    value = azurerm_linux_web_app.strapi["prod"].custom_domain_verification_id
  }
}

resource "azurerm_dns_cname_record" "adventistclujro-prod-cms-test" {
  name                = "cms-test"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  record              = azurerm_linux_web_app.strapi["test"].default_hostname
}

resource "azurerm_dns_txt_record" "adventistclujro-prod-cms-test-verify" {
  name                = "asuid.cms-test"
  zone_name           = azurerm_dns_zone.azscj-zone.name
  resource_group_name = azurerm_resource_group.common.name
  ttl                 = 300
  
  record {
    value = azurerm_linux_web_app.strapi["test"].custom_domain_verification_id
  }
}

resource "azurerm_app_service_managed_certificate" "managed_certificate" {
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.hostname_binding.id
}

resource "azurerm_app_service_certificate_binding" "managed_certificate_binding" {
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.hostname_binding.id
  certificate_id      = azurerm_app_service_managed_certificate.managed_certificate.id
  ssl_state           = "SniEnabled"
}

resource "azurerm_app_service_managed_certificate" "www_managed_certificate" {
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.www_hostname_binding.id
}

resource "azurerm_app_service_certificate_binding" "www_managed_certificate_binding" {
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.www_hostname_binding.id
  certificate_id      = azurerm_app_service_managed_certificate.www_managed_certificate.id
  ssl_state           = "SniEnabled"
}

resource "azurerm_app_service_managed_certificate" "test_managed_certificate" {
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.test_hostname_binding.id
}

resource "azurerm_app_service_certificate_binding" "test_managed_certificate_binding" {
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.test_hostname_binding.id
  certificate_id      = azurerm_app_service_managed_certificate.test_managed_certificate.id
  ssl_state           = "SniEnabled"
}

resource "azurerm_app_service_managed_certificate" "cms_managed_certificate" {
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.strapi_hostname_binding.id
}

resource "azurerm_app_service_certificate_binding" "cms_managed_certificate_binding" {
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.strapi_hostname_binding.id
  certificate_id      = azurerm_app_service_managed_certificate.cms_managed_certificate.id
  ssl_state           = "SniEnabled"
}

resource "azurerm_app_service_managed_certificate" "cms_test_managed_certificate" {
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.strapi_test_hostname_binding.id
}

resource "azurerm_app_service_certificate_binding" "cms_test_managed_certificate_binding" {
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.strapi_test_hostname_binding.id
  certificate_id      = azurerm_app_service_managed_certificate.cms_test_managed_certificate.id
  ssl_state           = "SniEnabled"
}
