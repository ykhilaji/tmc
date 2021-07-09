"use strict";
const ws = require("ws"); // websockets


const MessageTypes = require("../webSocket/message-types");
const ADDRESS = require("../util/const");



function start(cookieJar) {

    var self = this;
    const socket = new ws(ADDRESS.WEBSOCKET_HOST_QUALIF, {
      headers: {
        Cookie: cookieJar.getCookieString(ADDRESS.SERVERQUALIF)    
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

  exports.start = start;