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

resource "azurerm_user_assigned_identity" "assigned-identity-acr-pull" {
  resource_group_name = azurerm_resource_group.common.name
  location            = azurerm_resource_group.common.location
  name                = "User-ACR-pull"
}

resource "azurerm_container_registry" "acr" {
  name                = "azscjacr"
  resource_group_name = azurerm_resource_group.common.name
  location            = azurerm_resource_group.common.location
  sku                 = "Basic"
  admin_enabled       = true

  identity {
    type = "UserAssigned"
    identity_ids = [
      azurerm_user_assigned_identity.assigned-identity-acr-pull.id
    ]
  }
}

resource "azurerm_role_assignment" "acr-pull" {
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
  principal_id         = azurerm_user_assigned_identity.assigned-identity-acr-pull.principal_id
}

resource "azurerm_resource_group" "website" {
  for_each = var.environments
  name     = "${var.website_name}-${each.key}-rg"
  location = "Germany West Central"
}

// Common database
resource "azurerm_mysql_flexible_server" "cms-db" {
  name                   = "cms-db"
  resource_group_name    = azurerm_resource_group.common.name
  location               = azurerm_resource_group.common.location
  administrator_login    = "psqladmin"
  administrator_password = "H@Sh1CoR3!"
  backup_retention_days  = 7
  sku_name               = "B_Standard_B1s"
  version                = "8.0.21"
}

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
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [resource.azurerm_user_assigned_identity.assigned-identity-acr-pull.principal_id]
  }

  site_config {
    scm_type                            = "VSTSRM"
    linux_fx_version                    = "DOCKER|azscjacr.azurecr.io/azscjstrapi:1404504103"
    acr_user_managed_identity_client_id = azurerm_user_assigned_identity.assigned-identity-acr-pull.principal_id
  }

  app_settings = {
    "SOME_KEY" = "some-value"
  }
}
