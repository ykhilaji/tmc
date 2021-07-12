"use strict";

const ajax = require("../util/ajax");
const ADDRESS = require("../util/const");
const noop = require("../util/noop");


function start(cookieJar, onComplete, onError) {
    if (onComplete === void 0) { onComplete = noop["default"]; }
    if (onError === void 0) { onError = noop["default"]; }

    ajax.call({
        url: `${ADDRESS.SERVER_LOCAL}` + "/api/refreshSession",
        headers: { 'Accept': 'application/json' },
        jar: cookieJar
    }, function (json) { return onComplete(json); }, function (error) { return onError(error); });
}
exports.start = start;
