class AWSApiResponse {
  constructor(statusCode, body, headers = {}) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = headers['Content-Type'] == 'text/plain' ? body : JSON.stringify(body);
  }

  setHeader (name, value) {
    if (!this.headers) this.headers = {};
    this.headers[name] = value;
    return this;
  }

  cors (event) {
    if (!this.headers) this.headers = {};
    this.headers['Access-Control-Allow-Origin'] = getOrigin(event);
    this.headers['Access-Control-Allow-Credentials'] = 'true';
    this.headers['Access-Control-Allow-Headers'] = 'authorization, content-type, x-exl-apikey';
    this.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    this.headers['Access-Control-Max-Age'] = 86400;
    return this;
  }  
}

function success(body, contentType = "application/json") {
  return new AWSApiResponse(200, body, { "Content-Type": contentType });
}

function unauthorized() {
  return new AWSApiResponse(401, 'Unauthorized');
}

function notfound() {
  return new AWSApiResponse(404, 'Not found');
}

function error(msg) {
  return new AWSApiResponse(400, msg)
}

function nocontent() {
  return new AWSApiResponse(204);
}

const getOrigin = event => {
  return event && event.headers && (event.headers.origin || event.headers.Origin) || '*'
};

module.exports = { success, unauthorized, error, notfound, nocontent };
