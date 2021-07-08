// GLOBAL VARIABLES
const WEBSOCKET_HOST = "ws://192.168.1.2:8080/ws";
const SERVER_LOCAL = "http://192.168.1.2:8080";
const SERVERQUALIF = "https://qualification.colissimo.fr/entreprise/coliship";
const WEBSOCKET_HOST_QUALIF = "wss://qualification.colissimo.fr/entreprise/coliship/ws";

// LIBS
const ws = require("ws"); // websockets
const fs = require("fs"); // file system
const request = require("request");
const FormData = require('form-data');



const ajax = require("./ajax");
const MessageTypes = require("./message-types");

let cookieJar = request.jar();

/**
 * fonction connection a coliship
 * @param {*} login 
 * @param {*} password 
 */

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

/**
 * 
 * @param {*} cookieJar 
 * @param {*} folder 
 */
function importFiles(cookieJar, folder) {
  fs.readdir(folder, function (err, folderFiles) {
      folderFiles.forEach(function (file) {
          var filePath = folder + "/" + file;
         // console.log("file to hundle :", filePath);
          importFile(cookieJar, filePath, function () { console.log("------------------------FIN IMPORT FILE--------------")});
      });
  });
}
/**
 * fonction import fichier dans coliship a l'instart de la scuration 
 * @param {*} cookieJar 
 * @param {*} filePath 
 * @param {*} onComplete 
 */

function importFile(cookieJar, filePath, onComplete) {
  if (onComplete === void 0) { onComplete = noop_1["default"]; }
  ajax.call({
      url: `${SERVER_LOCAL}/api/affrAuto/import?triggerPrint=true&saveErrors=false`,
      method: 'POST',
      jar: cookieJar,
      formData: {
          importColis: fs.createReadStream(filePath)
      }
  }, function (json) {
      console.info("Import file " + filePath + " success");
      onComplete(json);
  }, function (error, response) {
      console.error("Import file error: '" + response.statusCode + ": " + response.statusMessage + "'", response.body);
  });
}

connectColiship("hbouti", "atos2017");

function onLoginSuccess(login, response) {
  const cookieStr = response.headers['set-cookie'][0];
  console.log("cookieStr : ", cookieStr);
  cookieJar.setCookie(request.cookie(cookieStr), SERVER_LOCAL);
  createWebSocket(cookieJar);
  importFiles(cookieJar, "./data/");

}


function createWebSocket(cookieJar) {
  var self = this;
  const socket = new ws(WEBSOCKET_HOST, {
    headers: {
      Cookie: cookieJar.getCookieString(SERVER_LOCAL)
    }
  });

  setInterval(alert, 3000);
  setInterval(infoPrinterAndKeepAlive, 5000); // 5 seconds

  function alert() {
    if (socket.readyState === 1) {
      self.sendMessage(MessageTypes.LP_ALERTE_MSG);
    }
  }

  function infoPrinterAndKeepAlive() {
    if (socket.readyState === 1) {
      self.sendMessage(MessageTypes.LP_DATA_PRINTER);
    }
  }

  this.sendMessage = function (type, payload) {
    sendMessageRaw(buildMessage(type, payload));
  };

  function buildMessage(type, payload) {
    return {
      type: type,
      payload: payload || {},
    };
  }

  function sendMessageRaw(message) {
    let serializedMessage = JSON.stringify(message);
    try {
      JSON.parse(serializedMessage);
    } catch (e) {
      console.error(
        "error",
        new Error(`Message must be JSON-serializable. Got: ${message}`)
      );
    }
    console.log("message to send : ", message);
    socket.send(serializedMessage);
  }

  socket.on("open", () => {
    console.log("Connection Established!");
    self.sendMessage(MessageTypes.LP_CONNECTION_INIT, {});
  });

  socket.on("message", message => {
    console.log(message);
  });

  return socket;
}


