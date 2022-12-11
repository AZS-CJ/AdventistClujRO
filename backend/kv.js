const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();

const vaultName = process.env.KV_NAME;
const url = `https://${vaultName}.vault.azure.net`;

async function setSecret(name, value) {
  // Change the Azure Key Vault service API version being used via the `serviceVersion` option
  const client = new SecretClient(url, credential, {
    serviceVersion: "7.0",
  });

  await client.setSecret(name, value);
}

async function getSecret(name) {
  // Change the Azure Key Vault service API version being used via the `serviceVersion` option
  const client = new SecretClient(url, credential, {
    serviceVersion: "7.0",
  });

  return await client.getSecret(name);
}

module.exports = {
  setSecret,
  getSecret
}
