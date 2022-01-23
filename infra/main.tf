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
      version = "2.82.0"
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

resource "azurerm_app_service_plan" "web-sites-service-plan" {
  name                = "${var.website_name}-ServicePlan"
  location            = azurerm_resource_group.common.location
  resource_group_name = azurerm_resource_group.common.name

  kind     = "linux"
  reserved = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "app_service" {
  for_each            = var.environments
  name                = "${var.website_name}-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  app_service_plan_id = azurerm_app_service_plan.web-sites-service-plan.id

  site_config {
    scm_type         = "None"
    linux_fx_version = "NODE|12.9"
  }

  app_settings = {
    "SOME_KEY" = "some-value"
  }

  connection_string {
    name  = "Database"
    type  = "Custom"
    value = "NoConnectionStringNeededYet"
  }
}

// Strapi
resource "azurerm_app_service" "strapi" {
  for_each            = var.environments
  name                = "${var.website_name}-strapi-${each.key}"
  location            = azurerm_resource_group.website[each.key].location
  resource_group_name = azurerm_resource_group.website[each.key].name
  app_service_plan_id = azurerm_app_service_plan.web-sites-service-plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    scm_type                             = "VSTSRM"
    linux_fx_version                     = "DOCKER|azscjacr.azurecr.io/azscjstrapi:1735483858"
    acr_use_managed_identity_credentials = true
  }

  app_settings = {
    "DATABASE_CLIENT"   = "mysql"
    "DATABASE_HOST"     = azurerm_mysql_flexible_server.cms-db.fqdn
    "DATABASE_PORT"     = "3306"
    "DATABASE_NAME"     = "cms-db-${each.key}"
    "DATABASE_USERNAME" = "mysqladminuser"
    "DATABASE_PASSWORD" = random_password.admin-login-pass.result
  }
}

resource "azurerm_role_assignment" "acr" {
  for_each             = azurerm_app_service.strapi
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = each.value.identity[0].principal_id
}
