"use strict";

const FormData = require('form-data');
const request = require("request");
const path = require("path");
const ajax = require("../util/ajax");
const ADDRESS = require("../util/const");
const jobImportColis = require("../job/jobImportColis");
const jobWebSocket = require("../job/jobWebSocket");
const jobSession = require("../job/jobSession");
const jobPrintTasks = require("../job/jobTasks");

const PATH_FILE = path.join(__dirname, "../data/");




function start(login, password, cookieJar) {
  const form = new FormData();
  form.append('login', login);
  form.append('password', password);

  ajax.call({
    url: `${ADDRESS.SERVER_LOCAL}/appDesktop/login`,
    method: 'POST',
    form: { login: login, password: password },
    jar: cookieJar
  }, function (json, response) {
    console.log("°°°°°°°°°°°°°°°°°°OK°°°°°°°°°°°°");
    onLoginSuccess(response, cookieJar);
  }, function (error, response) {
    console.log("------------------KO------------");
    onLoginSuccess(response, cookieJar);
  });
}

function onLoginSuccess(response, cookieJar) {
  const cookieStr = response.headers['set-cookie'][0];
  cookieJar.setCookie(request.cookie(cookieStr), ADDRESS.SERVER_LOCAL);

  jobImportColis.start(cookieJar, PATH_FILE);
  jobWebSocket.start(cookieJar);
  jobSession.start(cookieJar, ok => { console.log("session OK :", ok), error => { } });
  jobPrintTasks.start(cookieJar);



}

exports.start = start;