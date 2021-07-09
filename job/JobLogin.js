"use strict";

const FormData = require('form-data');
const request = require("request");
const path = require("path");
const ajax = require("../util/ajax");
const ADDRESS = require("../util/const");
const jobImportColis = require("../job/jobImportColis");
const jobWebSocket = require("../job/jobWebSocket");

const PATH_FILE = path.join(__dirname, "../data/");




function start(login, password, cookieJar) {
  const form = new FormData();
  form.append('login', login);
  form.append('password', password);

  ajax.call({
    url: `${ADDRESS.SERVERQUALIF}/appDesktop/login`,
    method: 'POST',
    form: { login: login, password: password },
    jar: cookieJar
  }, function (json, response) {
    console.log("°°°°°°°°°°°°°°°°°°OK°°°°°°°°");
    onLoginSuccess(response, cookieJar);
  }, function (error, response) {
    console.log("------------------KO---------");
    onLoginSuccess(response, cookieJar);
  });
}

function onLoginSuccess(response, cookieJar) {
  const cookieStr = response.headers['set-cookie'][0];
  cookieJar.setCookie(request.cookie(cookieStr), ADDRESS.SERVERQUALIF);


  jobImportColis.start(cookieJar, PATH_FILE);
  jobWebSocket.start(cookieJar);


}

exports.start = start;