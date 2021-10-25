const { success, notfound, error, unauthorized, nocontent } = require('./responses');
const { setApikey, getApikey } = require('./apikeys');
const { setConfig, getConfig } = require('./config');
const { parse } = require('querystring');
const alma = require('almarestapi-lib');

const handler = async (event, context) => {
  let inst_code;
  if (event.routeKey.includes('/config')) {
    ({ inst_code } = event.requestContext?.authorizer?.jwt?.claims || {});
    if (!inst_code) return unauthorized();
  } else {
    ({ inst_code } = event.pathParameters);
  }
  
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : JSON.parse(event.body || '{}');

  let result, config, apikey;
  try {
    switch (event.routeKey) {
      case 'PUT /config':
        ({ apikey, ...config } = body);
        await setConfig(inst_code, config);
        if (!apikey.startsWith("*")) {
          await setApikey(inst_code, apikey);
        }
        result = success("ok");
        break;
      case 'GET /config':
        apikey = obfuscate(await getApikey(inst_code));
        config = await getConfig(inst_code);
        result = success({ ...config, apikey });
        break;
      case 'GET /{inst_code}/health':
        apikey = await getApikey(inst_code);
        if (!apikey) {
          result = error({ status: 'error', msg: 'No apikey defined.' });
        } else {
          try {
            alma.setOptions(apikey);
            await alma.postXmlp('/users/operation/test', null);
            result = success({ status: 'ok' });
          } catch (e) {
            console.warn('Error calling Alma API', e);
            result = error({ status: 'error', msg: 'Apikey not configured properly'} );
          }
        }
        break;
      case 'POST /{inst_code}':
        const { user, pass } = parse(body);
        apikey = await getApikey(inst_code);
        config = await getConfig(inst_code);
        const groups = config.groups || {};
        try {
          result = success(await authenticate(apikey, groups, inst_code, user, pass), "text/plain");
        } catch (e) {
          result = error(e);
        }
        break;
      case 'GET /{inst_code}':
        result = success("Hosted EZ Proxy Auth");
        break;
      default:
        result = notfound();
    }
  } catch (e) {
    console.error('error', e);
    result = error(e.message);
  }
  return result;
}

module.exports = { handler };

const obfuscate = val => {
    const re = new RegExp(`^.{1,${val.length-5}}`,"g");
    return val.replace(re, m => "*".repeat(m.length));
}

const authenticate = async (apikey, groups, inst_code, user, pass) => {
    alma.setOptions(apikey);
    try {
      await alma.postp(`/users/${user}?op=auth&password=${pass}`, null);
      let resp = await alma.getp(`/users/${user}`);
      const usergroup = resp.user_group.value;
      let response = '+VALID\nezproxy_group=';
      if (groups) {
        const ezproxyGroup = groups && Object.entries(groups).find(([k,v])=>Array.isArray(v) 
          ? v.includes(usergroup) || v.includes('*') 
          : v === usergroup || v == '*'
        );
        if (ezproxyGroup) response += ezproxyGroup[0].replace(/ /, '+');
      }
      return response;
    } catch(e) {
      console.error('e', e);
      throw e.message;
    }
}