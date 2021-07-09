

// LIBS
const request = require("request");

const jobLogin = require("../job/jobLogin");


let cookieJar = request.jar();

const login = "hbouti";
const password = "atos2017";

jobLogin.start(login, password, cookieJar)








