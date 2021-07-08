"use strict";
const ajax = require("./ajax");
const FormData = require('form-data');

function connectColiship(login, password) {
    const form = new FormData();
    form.append('login', login);
    form.append('password', password);
  
    ajax.call({
      url: `${SERVER_LOCAL}/appTMC/loginTMC`,
      method: 'POST',
      form: { login: login, password: password },
      jar: cookieJar
    }, function (json, response) {
      console.log("°°°°°°°°°°°°°°°°°°OK°°°°°°°°");
      onLoginSuccess(login, response);
    }, function (error, response) {
      console.log("------------------KO---------");
      onLoginSuccess(login, response);
    });
  }