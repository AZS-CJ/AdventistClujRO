# terraform {
#   backend "azurerm" {
#     resource_group_name   = "tstate"
#     storage_account_name  = "tstate09762"
#     container_name        = "tstate"
#     key                   = "terraform.tfstate"
#   }
# }

provider "azurerm" {
  # Whilst version is optional, we /strongly recommend/ using it to pin the version of the Provider being used
  version = "=2.5.0"
  features {}
}

resource "azurerm_resource_group" "EnvironmentResource" {
  name     = "${var.website_name}-${var.environment_name}-RG"
  location = "Germany West Central"
}

resource "azurerm_app_service_plan" "WebSitesServicePlan" {
  name                = "${var.website_name}-ServicePlan-${var.environment_name}"
  location            = azurerm_resource_group.EnvironmentResource.location
  resource_group_name = azurerm_resource_group.EnvironmentResource.name

  kind                = "linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "WebSiteappServiceTest" {
  name                = "${var.website_name}-test"
  location            = azurerm_resource_group.EnvironmentResource.location
  resource_group_name = azurerm_resource_group.EnvironmentResource.name
  app_service_plan_id = azurerm_app_service_plan.WebSitesServicePlan.id

  site_config {
    scm_type                 = "None"
    linux_fx_version         = "NODE|12.9"
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

resource "azurerm_app_service" "WebSiteappServiceProd" {
  name                = "${var.website_name}-prod"
  location            = azurerm_resource_group.EnvironmentResource.location
  resource_group_name = azurerm_resource_group.EnvironmentResource.name
  app_service_plan_id = azurerm_app_service_plan.WebSitesServicePlan.id

  site_config {
    scm_type                 = "None"
    linux_fx_version         = "NODE|12.9"
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
