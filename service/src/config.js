const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let _configuration;
const Bucket = process.env.CONFIG_S3_BUCKET;
const Key = 'exl-ezproxy-auth-hosted/config.json'

const getConfig = async (instCode) => {
  const config = await getConfiguration();
  return config[instCode] || {};
}

const setConfig = async (instCode, conf) => {
  await getConfig(true);
  _configuration[instCode] = conf;
  const Body = JSON.stringify(_configuration);
  await s3.putObject({ Body, Bucket, Key }).promise();
}

const getConfiguration = async (force = false) => {
  if (!_configuration || force) {
    let config;
    try {
      const response = await s3.getObject({ Bucket, Key }).promise();  
      config = response.Body.toString('utf-8')
    } catch (e) {
      console.warn(`Error retrieving config file: ${e.message}`)
    }
    
    _configuration = JSON.parse(config || '{}');
  }
  return _configuration;
}

module.exports = { getConfig, setConfig }