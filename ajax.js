"use strict";

const request = require("request");

function safeJsonParse(str) {
    if (typeof str === 'object') return str; // we already have an object
    if (str === undefined || str === null) return {};
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }


function isOkStatus(s) {
    return s >= 200 && s < 300 || s === 304;
}

function call(options, onComplete, onError) {
    if (onComplete === void 0) { onComplete = noop_1["default"]; }
    if (onError === void 0) { onError = noop_1["default"]; }
    if (options.method === 'POST') {
        if (options.headers === undefined)
            options['headers'] = {};
        options.headers['X-Requested-With'] = 'XmlHTTPRequest';
    }
    
    request(options, function (error, response, body) {
        if (!error && isOkStatus(response.statusCode)) {
            onComplete(safeJsonParse(body), response);
        }
        else {
            onError(error, response);
        }
    });
}

exports.call = call;