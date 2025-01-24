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
      version = "3.98.0"
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

resource "random_password" "admin-login-pass" {
  length  = 32
  special = true
}

resource "azurerm_log_analytics_workspace" "log-analytics-workspace-common" {
  name                = "log-analytics-workspace-common"
  location            = azurerm_resource_group.common.location
  resource_group_name = azurerm_resource_group.common.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
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
  zone                   = 1
}

resource "azurerm_service_plan" "web-sites-service-plan" {
  name                = "${var.website_name}-ServicePlan"
  location            = azurerm_resource_group.common.location
  resource_group_name = azurerm_resource_group.common.name

  os_type  = "Linux"
  sku_name = "B3"
}

resource "azurerm_mysql_flexible_database" "site-db" {
  for_each            = var.sites
  name                = "db-site-${each.value.name}"
  resource_group_name = azurerm_resource_group.common.name
  server_name         = azurerm_mysql_flexible_server.cms-db.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_0900_ai_ci"
}

resource "azurerm_mysql_flexible_server_firewall_rule" "AllAccessRule" {
  name                = "AllAccessRule"
  resource_group_name = azurerm_resource_group.common.name
  server_name         = azurerm_mysql_flexible_server.cms-db.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

resource "azurerm_resource_group" "site-rg" {
  for_each = var.sites
  name     = "${each.value.name}-rg"
  location = "Germany West Central"
}

resource "azurerm_storage_account" "cms-storage-site" {
  for_each            = var.sites
  name                = "strapisa${each.value.name}"
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name

  location                 = azurerm_resource_group.site-rg[each.value.name].location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_share" "cms-storage-share-site" {
  for_each             = var.sites
  name                 = "strapish${each.value.name}"
  storage_account_name = azurerm_storage_account.cms-storage-site[each.value.name].name
  quota                = 5
  acl {
    id = "acl-file-share-strapi-uploads"

    access_policy {
      permissions = "rwdl"
    }
  }
}

resource "azurerm_storage_share_directory" "strapi-uploads" {
  for_each         = var.sites
  name             = "uploads"
  storage_share_id = azurerm_storage_share.cms-storage-share-site[each.value.name].id
}

resource "random_password" "strapi-site-admin-jwt-secret" {
  for_each = var.sites
  length   = 32
  special  = false
}

resource "random_password" "strapi-site-jwt-secret" {
  for_each = var.sites
  length   = 32
  special  = false
}

resource "random_password" "strapi-site-app-key1" {
  for_each = var.sites
  length   = 16
  special  = true
}

resource "random_password" "strapi-site-app-key2" {
  for_each = var.sites
  length   = 16
  special  = true
}

resource "random_password" "strapi-site-app-key3" {
  for_each = var.sites
  length   = 16
  special  = true
}

resource "random_password" "strapi-site-app-key4" {
  for_each = var.sites
  length   = 16
  special  = true
}

resource "random_password" "strapi-site-api-token-salt" {
  for_each = var.sites
  length   = 16
  special  = true
}

resource "random_password" "strapi-site-transfer-token-salt" {
  for_each = var.sites
  length   = 16
  special  = true
}

resource "azurerm_linux_web_app" "linux-web-app-strapi" {
  for_each            = var.sites
  name                = "webapp-cms-${each.value.name}"
  location            = azurerm_resource_group.site-rg[each.value.name].location
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  service_plan_id     = azurerm_service_plan.web-sites-service-plan.id
  https_only          = true

  site_config {
    use_32_bit_worker                       = false
    health_check_path                       = "/api/under-construction"
    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name = "azsstrapi:latest"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
    }
  }

  app_settings = {
    "DATABASE_CLIENT"     = "mysql"
    "DATABASE_HOST"       = azurerm_mysql_flexible_server.cms-db.fqdn
    "DATABASE_PORT"       = "3306"
    "DATABASE_NAME"       = "db-site-${each.value.name}"
    "DATABASE_USERNAME"   = "mysqladminuser"
    "DATABASE_PASSWORD"   = random_password.admin-login-pass.result
    "ADMIN_JWT_SECRET"    = base64encode(random_password.strapi-site-admin-jwt-secret[each.value.name].result)
    "JWT_SECRET"          = base64encode(random_password.strapi-site-jwt-secret[each.value.name].result)
    "APP_KEYS"            = "${base64encode(random_password.strapi-site-app-key1[each.value.name].result)},${base64encode(random_password.strapi-site-app-key2[each.value.name].result)},${base64encode(random_password.strapi-site-app-key3[each.value.name].result)},${base64encode(random_password.strapi-site-app-key4[each.value.name].result)}"
    "API_TOKEN_SALT"      = base64encode(random_password.strapi-site-api-token-salt[each.value.name].result)
    "TRANSFER_TOKEN_SALT" = base64encode(random_password.strapi-site-transfer-token-salt[each.value.name].result)
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
        retention_in_mb   = 35
      }
    }
  }

  storage_account {
    access_key   = azurerm_storage_account.cms-storage-site[each.value.name].primary_access_key
    name         = "strapibinary"
    account_name = azurerm_storage_account.cms-storage-site[each.value.name].name
    share_name   = azurerm_storage_share.cms-storage-share-site[each.value.name].name
    type         = "AzureFiles"
    mount_path   = "/opt/app/public"
  }
}

resource "azurerm_role_assignment" "acr-for-linux-web-app-strapi" {
  for_each             = var.sites
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = azurerm_linux_web_app.linux-web-app-strapi[each.value.name].identity.0.principal_id
}

resource "azurerm_linux_web_app" "linux-web-app-frontend" {
  for_each            = var.sites
  name                = "webapp-frontend-${each.value.name}"
  location            = azurerm_resource_group.site-rg[each.value.name].location
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  service_plan_id     = azurerm_service_plan.web-sites-service-plan.id
  https_only          = true

  site_config {
    use_32_bit_worker                       = false
    health_check_path                       = "/"
    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name   = "azsweb:latest"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
    }
  }

  app_settings = {
    "CMS_DB_HOST" : "https://${azurerm_linux_web_app.linux-web-app-strapi[each.value.name].default_hostname}"
    "YT_API_KEY": var.yt_api_key
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
        retention_in_mb   = 35
      }
    }
  }
}

resource "azurerm_role_assignment" "acr-for-linux-web-app-frontend" {
  for_each             = var.sites
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].identity.0.principal_id
}

resource "azurerm_dns_zone" "website-dns-zone" {
  for_each            = var.sites-verifications
  name                = each.value.domain
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
}

// Apex
resource "azurerm_dns_a_record" "website-naked" {
  for_each            = var.sites-verifications
  name                = "@"
  zone_name           = azurerm_dns_zone.website-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 3600
  records             = ["${each.value.ipweb}"]
  # The ip has to be put manually for now
  # https://github.com/Azure/azure-rest-api-specs/issues/27377
  # https://github.com/hashicorp/terraform-provider-azurerm/issues/14642
  depends_on = [ azurerm_dns_zone.website-dns-zone ]
}

resource "azurerm_dns_txt_record" "website-naked-verification" {
  for_each            = var.sites-verifications
  name                = "asuid"
  zone_name           = azurerm_dns_zone.website-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].custom_domain_verification_id
  }

  depends_on = [ azurerm_dns_zone.website-dns-zone ]
}

resource "azurerm_app_service_custom_hostname_binding" "webhostname_binding" {
  for_each            = var.sites-verifications
  hostname            = each.value.domain
  app_service_name    = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name

  depends_on = [ azurerm_dns_a_record.website-naked ]
}

resource "azurerm_app_service_managed_certificate" "website-managed_certificate" {
  for_each = var.sites-verifications
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.webhostname_binding[each.value.name].id
}

resource "azurerm_app_service_certificate_binding" "website-managed_certificate_binding" {
  for_each = var.sites-verifications
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.webhostname_binding[each.value.name].id
  certificate_id      = azurerm_app_service_managed_certificate.website-managed_certificate[each.value.name].id
  ssl_state           = "SniEnabled"

  depends_on = [ azurerm_dns_txt_record.website-naked-verification ]
}

// www
resource "azurerm_dns_cname_record" "website-www" {
  for_each            = var.sites-verifications
  name                = "www"
  zone_name           = azurerm_dns_zone.website-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300
  record              = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].default_hostname

  depends_on = [ azurerm_dns_zone.website-dns-zone ]
}

resource "azurerm_dns_txt_record" "website-www-verification" {
  for_each            = var.sites-verifications
  name                = "asuid.www"
  zone_name           = azurerm_dns_zone.website-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].custom_domain_verification_id
  }

  depends_on = [ azurerm_dns_zone.website-dns-zone ]
}

resource "azurerm_app_service_custom_hostname_binding" "www_webhostname_binding" {
  for_each            = var.sites-verifications
  hostname            = "www.${each.value.domain}"
  app_service_name    = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name

  depends_on = [ azurerm_dns_cname_record.website-www ]
}

resource "azurerm_app_service_managed_certificate" "www_website_managed_certificate" {
  for_each = var.sites-verifications
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.www_webhostname_binding[each.value.name].id
}

resource "azurerm_app_service_certificate_binding" "www_web_managed_certificate_binding" {
  for_each = var.sites-verifications
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.www_webhostname_binding[each.value.name].id
  certificate_id      = azurerm_app_service_managed_certificate.www_website_managed_certificate[each.value.name].id
  ssl_state           = "SniEnabled"

  depends_on = [ azurerm_dns_txt_record.website-www-verification ]
}

// cms
resource "azurerm_dns_cname_record" "website-cms" {
  for_each            = var.sites-verifications
  name                = "cms"
  zone_name           = azurerm_dns_zone.website-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300
  record              = azurerm_linux_web_app.linux-web-app-strapi[each.value.name].default_hostname

  depends_on = [ azurerm_dns_zone.website-dns-zone ]
}

resource "azurerm_dns_txt_record" "cms-webhost-verification" {
  for_each            = var.sites-verifications
  name                = "asuid.cms"
  zone_name           = azurerm_dns_zone.website-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_linux_web_app.linux-web-app-strapi[each.value.name].custom_domain_verification_id
  }
}

resource "azurerm_app_service_custom_hostname_binding" "cms_webhostname_binding" {
  for_each            = var.sites-verifications
  hostname            = "cms.${each.value.domain}"
  app_service_name    = azurerm_linux_web_app.linux-web-app-strapi[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name

  depends_on = [ azurerm_dns_cname_record.website-cms  ]
}

resource "azurerm_app_service_managed_certificate" "cms_webhost_managed_certificate" {
  for_each = var.sites-verifications
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.cms_webhostname_binding[each.value.name].id

  depends_on = [ azurerm_app_service_custom_hostname_binding.cms_webhostname_binding ]
}

resource "azurerm_app_service_certificate_binding" "cms_webhost_managed_certificate_binding" {
  for_each = var.sites-verifications
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.cms_webhostname_binding[each.value.name].id
  certificate_id      = azurerm_app_service_managed_certificate.cms_webhost_managed_certificate[each.value.name].id
  ssl_state           = "SniEnabled"

  depends_on = [ azurerm_dns_txt_record.cms-webhost-verification ]
}
