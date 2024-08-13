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

resource "azurerm_dns_zone" "site-dns-zone" {
  for_each            = var.sites
  count               = each.value.enableDomain ? 1 : 0
  name                = each.value.domain
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
}

resource "azurerm_dns_a_record" "site-naked" {
  for_each            = var.sites
  name                = "@"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 3600
  records             = each.value.ip_web
  # The ip has to be put manually for now
  # https://github.com/Azure/azure-rest-api-specs/issues/27377
  # https://github.com/hashicorp/terraform-provider-azurerm/issues/14642
}

resource "azurerm_dns_txt_record" "site-naked-verification" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "asuid"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].custom_domain_verification_id
  }
}

resource "azurerm_dns_cname_record" "site-www" {
  for_each            = var.sites
  name                = "www"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300
  record              = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].ingress[0].fqdn
}

resource "azurerm_dns_txt_record" "site-www-verification" {
  for_each            = var.sites
  name                = "asuid.www"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_linux_web_app.linux-web-app-frontend[each.value.name].custom_domain_verification_id
  }
}

resource "azurerm_app_service_custom_hostname_binding" "hostname_binding" {
  for_each            = var.sites-verifications
  hostname            = each.value.domain
  app_service_name    = azurerm_linux_web_app.linux-web-app-strapi[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
}

resource "azurerm_app_service_custom_hostname_binding" "www_hostname_binding" {
  for_each            = var.sites-verifications
  hostname            = "www.${each.value.name}"
  app_service_name    = azurerm_linux_web_app.linux-web-app-strapi[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
}

// Done so far

resource "azurerm_container_app" "strapi-container" {
  for_each                     = var.sites
  name                         = "cms-${each.value.name}-app"
  container_app_environment_id = azurerm_container_app_environment.platform.id
  resource_group_name          = azurerm_resource_group.site-rg[each.value.name].name
  revision_mode                = "Single"

  secret {
    name  = "adminpassword"
    value = azurerm_container_registry.acr.admin_password
  }

  workload_profile_name = "Consumption"

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "adminpassword"
  }

  ingress {
    target_port = "1337"
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
    transport        = "http"
    external_enabled = true
  }

  template {
    volume {
      name         = "strapiuploads"
      storage_name = azurerm_container_app_environment_storage.environment-storage[each.value.name].name
      storage_type = "AzureFile"
    }
    container {
      name   = "strapi"
      image  = "${azurerm_container_registry.acr.login_server}/azsstrapi:latest"
      cpu    = 1
      memory = "2Gi"
      volume_mounts {
        name = "strapiuploads"
        path = "/opt/app/public"
      }
      env {
        name  = "DATABASE_CLIENT"
        value = "mysql"
      }
      env {
        name  = "DATABASE_HOST"
        value = azurerm_mysql_flexible_server.cms-db.fqdn
      }
      env {
        name  = "DATABASE_PORT"
        value = "3306"
      }
      env {
        name  = "DATABASE_NAME"
        value = "db-site-${each.value.name}"
      }
      env {
        name  = "DATABASE_USERNAME"
        value = "mysqladminuser"
      }
      env {
        name  = "DATABASE_PASSWORD"
        value = random_password.admin-login-pass.result
      }
      env {
        name  = "ADMIN_JWT_SECRET"
        value = base64encode(random_password.strapi-site-admin-jwt-secret[each.value.name].result)
      }
      env {
        name  = "JWT_SECRET"
        value = base64encode(random_password.strapi-site-jwt-secret[each.value.name].result)
      }
      env {
        name  = "APP_KEYS"
        value = "${base64encode(random_password.strapi-site-app-key1[each.value.name].result)},${base64encode(random_password.strapi-site-app-key2[each.value.name].result)},${base64encode(random_password.strapi-site-app-key3[each.value.name].result)},${base64encode(random_password.strapi-site-app-key4[each.value.name].result)}"
      }
      env {
        name  = "API_TOKEN_SALT"
        value = base64encode(random_password.strapi-site-api-token-salt[each.value.name].result)
      }
      env {
        name  = "TRANSFER_TOKEN_SALT"
        value = base64encode(random_password.strapi-site-transfer-token-salt[each.value.name].result)
      }
    }
  }
}

resource "azurerm_container_app" "web-container" {
  for_each                     = var.sites
  name                         = "web-${each.value.name}-app"
  container_app_environment_id = azurerm_container_app_environment.platform.id
  resource_group_name          = azurerm_resource_group.site-rg[each.value.name].name
  revision_mode                = "Single"

  secret {
    name  = "adminpassword"
    value = azurerm_container_registry.acr.admin_password
  }

  workload_profile_name = "Consumption"

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "adminpassword"
  }

  ingress {
    target_port = "80"
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
    transport        = "http"
    external_enabled = true
  }

  template {
    volume {
      name         = "strapiuploads"
      storage_name = azurerm_container_app_environment_storage.environment-storage[each.value.name].name
      storage_type = "AzureFile"
    }
    container {
      name   = "web"
      image  = "${azurerm_container_registry.acr.login_server}/azsweb:latest"
      cpu    = 0.5
      memory = "1Gi"
      env {
        name  = "CMS_DB_HOST"
        value = "https://${azurerm_container_app.strapi-container[each.value.name].ingress[0].fqdn}"
      }
      env {
        name  = "EMAIL_ADDRESS"
        value = ""
      }
      env {
        name  = "EMAIL_PASSWORD"
        value = ""
      }
    }
  }
}

resource "azurerm_dns_zone" "site-dns-zone" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = each.value.domain
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
}

resource "azurerm_dns_a_record" "site-naked" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "@"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 3600
  records             = [azurerm_container_app_environment.platform.static_ip_address]
}

resource "azurerm_dns_txt_record" "site-naked-verification" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "asuid"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_container_app.web-container[each.value.name].custom_domain_verification_id
  }
}

resource "azurerm_dns_cname_record" "site-www" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "www"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300
  record              = azurerm_container_app.web-container[each.value.name].ingress[0].fqdn
}

resource "azurerm_dns_txt_record" "site-www-verification" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "asuid.www"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_container_app.web-container[each.value.name].custom_domain_verification_id
  }
}

resource "null_resource" "web-hostnames" {
  for_each = var.only_platform_enabled ? var.only_platform : var.sites
  provisioner "local-exec" {
    command    = "az extension add --name containerapp --upgrade --allow-preview true"
    on_failure = fail
  }
  provisioner "local-exec" {
    command    = "az containerapp hostname add --resource-group ${azurerm_resource_group.site-rg[each.value.name].name} --name ${azurerm_container_app.web-container[each.value.name].name} --hostname ${each.value.domain}"
    on_failure = continue
  }

  provisioner "local-exec" {
    command    = "az containerapp hostname bind --resource-group ${azurerm_resource_group.site-rg[each.value.name].name} --name ${azurerm_container_app.web-container[each.value.name].name} --hostname ${each.value.domain} --environment ${azurerm_container_app_environment.platform.id} --validation-method TXT"
    on_failure = continue
  }

  lifecycle {
    replace_triggered_by = [
      azurerm_container_app.web-container,
      azurerm_dns_a_record.site-naked,
      azurerm_dns_txt_record.site-naked-verification,
      azurerm_dns_cname_record.site-www,
      azurerm_dns_txt_record.site-www-verification
    ]
  }
}

resource "azurerm_dns_cname_record" "cms" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "cms"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 3600
  record              = azurerm_container_app.strapi-container[each.value.name].ingress[0].fqdn
}

resource "azurerm_dns_txt_record" "cms-verification" {
  for_each            = var.only_platform_enabled ? var.only_platform : var.sites
  name                = "asuid.cms"
  zone_name           = azurerm_dns_zone.site-dns-zone[each.value.name].name
  resource_group_name = azurerm_resource_group.site-rg[each.value.name].name
  ttl                 = 300

  record {
    value = azurerm_container_app.strapi-container[each.value.name].custom_domain_verification_id
  }
}

resource "null_resource" "strapi-hostnames" {
  for_each = var.only_platform_enabled ? var.only_platform : var.sites
  provisioner "local-exec" {
    command    = "az extension add --name containerapp --upgrade"
    on_failure = fail
  }
  provisioner "local-exec" {
    command    = "az containerapp hostname add --resource-group ${azurerm_resource_group.site-rg[each.value.name].name} --name ${azurerm_container_app.strapi-container[each.value.name].name} --hostname cms.${each.value.domain}"
    on_failure = continue
  }

  provisioner "local-exec" {
    command    = "az containerapp hostname bind --resource-group ${azurerm_resource_group.site-rg[each.value.name].name} --name ${azurerm_container_app.strapi-container[each.value.name].name} --hostname cms.${each.value.domain} --environment ${azurerm_container_app_environment.platform.id} --validation-method CNAME"
    on_failure = fail
  }

  lifecycle {
    replace_triggered_by = [
      azurerm_container_app.strapi-container,
      azurerm_dns_cname_record.cms,
      azurerm_dns_txt_record.cms-verification
    ]
  }
}

####################################################################
####################################################################
####################################################################
####################################################################
# New schema above
# Old schema below
####################################################################
####################################################################
####################################################################
####################################################################

resource "azurerm_container_app_environment_storage" "environment-storage" {
  for_each                     = var.sites
  name                         = "envst${lower(each.value.name)}"
  container_app_environment_id = azurerm_container_app_environment.platform.id
  account_name                 = azurerm_storage_account.cms-storage-site[each.value.name].name
  share_name                   = azurerm_storage_share.cms-storage-share-site[each.value.name].name
  access_key                   = azurerm_storage_account.cms-storage-site[each.value.name].primary_access_key
  access_mode                  = "ReadWrite"
}

resource "azurerm_container_app_environment" "platform" {
  name                       = "AzsPlatform-Environment"
  location                   = azurerm_resource_group.common.location
  resource_group_name        = azurerm_resource_group.common.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.log-analytics-workspace-common.id

  workload_profile {
    name                  = "Consumption"
    workload_profile_type = "Consumption"
    maximum_count         = 4
    minimum_count         = 0
  }
}

resource "azurerm_application_insights" "AppInsights" {
  for_each            = var.environments
  name                = "aiazscj-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  workspace_id        = azurerm_log_analytics_workspace.log-analytics-workspace-common.id
  application_type    = "web"
}

resource "azurerm_linux_web_app" "webhost" {
  for_each            = var.environments
  name                = "${var.website_name}-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  service_plan_id     = azurerm_service_plan.web-sites-service-plan.id
  https_only          = true

  site_config {
    application_stack {
      node_version = "16-lts"
    }
    use_32_bit_worker = false
  }

  app_settings = {
    "CMS_DB_HOST"    = "https://${azurerm_linux_web_app.strapi[each.key].default_hostname}"
    "EMAIL_ADDRESS"  = each.key == "test" ? var.EMAIL_ADDRESS_TEST : var.EMAIL_ADDRESS_PROD
    "EMAIL_PASSWORD" = each.key == "test" ? var.EMAIL_PASSWORD_TEST : var.EMAIL_PASSWORD_PROD
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

resource "azurerm_storage_account" "cms-storage" {
  for_each            = var.environments
  name                = "strapisa${each.key}"
  resource_group_name = azurerm_resource_group.website[each.key].name

  location                 = azurerm_resource_group.common.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_resource_group" "website" {
  for_each = var.environments
  name     = "${var.website_name}-${each.key}-rg"
  location = "Germany West Central"
}

resource "azurerm_storage_share" "cms-storage-share" {
  for_each             = var.environments
  name                 = "strapish${each.key}"
  storage_account_name = azurerm_storage_account.cms-storage[each.key].name
  quota                = 5
  acl {
    id = "acl-file-share-strapi-uploads"

    access_policy {
      permissions = "rwdl"
    }
  }
}

resource "azurerm_linux_web_app" "strapi" {
  for_each            = var.environments
  name                = "${var.website_name}-strapi-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  service_plan_id     = azurerm_service_plan.web-sites-service-plan.id
  https_only          = true

  site_config {
    use_32_bit_worker                       = false
    health_check_path                       = "/api/under-construction"
    container_registry_use_managed_identity = true
  }

  app_settings = {
    "DATABASE_CLIENT"     = "mysql"
    "DATABASE_HOST"       = azurerm_mysql_flexible_server.cms-db.fqdn
    "DATABASE_PORT"       = "3306"
    "DATABASE_NAME"       = "cms-db-${each.key}"
    "DATABASE_USERNAME"   = "mysqladminuser"
    "DATABASE_PASSWORD"   = random_password.admin-login-pass.result
    "ADMIN_JWT_SECRET"    = base64encode(random_password.strapi-admin-jwt-secret[each.key].result)
    "JWT_SECRET"          = base64encode(random_password.strapi-jwt-secret[each.key].result)
    "APP_KEYS"            = "${base64encode(random_password.strapi-app-key1[each.key].result)},${base64encode(random_password.strapi-app-key2[each.key].result)},${base64encode(random_password.strapi-app-key3[each.key].result)},${base64encode(random_password.strapi-app-key4[each.key].result)}"
    "API_TOKEN_SALT"      = base64encode(random_password.api-token-salt[each.key].result)
    "TRANSFER_TOKEN_SALT" = base64encode(random_password.transfer-token-salt[each.key].result)
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
    access_key   = azurerm_storage_account.cms-storage[each.key].primary_access_key
    name         = "strapibinary"
    account_name = azurerm_storage_account.cms-storage[each.key].name
    share_name   = azurerm_storage_share.cms-storage-share[each.key].name
    type         = "AzureFiles"
    mount_path   = "/opt/app/public"
  }
}

resource "azurerm_storage_share_directory" "uploads" {
  for_each         = var.environments
  name             = "uploads"
  storage_share_id = azurerm_storage_share.cms-storage-share[each.key].id
}

resource "random_password" "strapi-admin-jwt-secret" {
  for_each = var.environments
  length   = 32
  special  = false
}

resource "random_password" "strapi-jwt-secret" {
  for_each = var.environments
  length   = 32
  special  = false
}

resource "random_password" "strapi-app-key1" {
  for_each = var.environments
  length   = 16
  special  = true
}

resource "random_password" "strapi-app-key2" {
  for_each = var.environments
  length   = 16
  special  = true
}

resource "random_password" "strapi-app-key3" {
  for_each = var.environments
  length   = 16
  special  = true
}

resource "random_password" "strapi-app-key4" {
  for_each = var.environments
  length   = 16
  special  = true
}

resource "random_password" "api-token-salt" {
  for_each = var.environments
  length   = 16
  special  = true
}

resource "random_password" "transfer-token-salt" {
  for_each = var.environments
  length   = 16
  special  = true
}

// Strapi

resource "azurerm_role_assignment" "acr" {
  for_each             = var.environments
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = azurerm_linux_web_app.strapi[each.key].identity.0.principal_id
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
