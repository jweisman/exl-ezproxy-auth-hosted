const AWS = require('aws-sdk');
const AWS_REGION = process.env.AWS_REGION;

AWS.config.update({region: AWS_REGION});
const sm = new AWS.SecretsManager();

let apikeys;
const SecretId = process.env.APIKEYS_SECRET;

const getApikey = async (instCode) => {
  const apikeys = await getApikeys();
  return apikeys[instCode] || '';
}

const setApikey = async (instCode, apikey) => {
  await getApikeys(true);
  apikeys[instCode] = apikey;
  const SecretString = JSON.stringify(apikeys);
  await sm.putSecretValue({ SecretId, SecretString }).promise();
}

const getApikeys = async (force = false) => {
  if (!apikeys || force) {
    let secret = await sm.getSecretValue({ SecretId }).promise();    
    apikeys = JSON.parse(secret.SecretString || '{}');
  }
  return apikeys;
}

module.exports = { getApikey, setApikey }