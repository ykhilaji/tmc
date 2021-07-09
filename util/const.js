// GLOBAL VARIABLES
"use strict";
var ADDRESS = (function () {

    function ADDRESS() {
        throw new Error('Static Class');
    }

    ADDRESS.WEBSOCKET_HOST = "ws://192.168.1.2:8080/ws";
    ADDRESS.SERVER_LOCAL = "http://192.168.1.2:8080";
    
    ADDRESS.SERVERQUALIF = "https://qualification.colissimo.fr/entreprise/coliship";
    ADDRESS.WEBSOCKET_HOST_QUALIF = "wss://qualification.colissimo.fr/entreprise/coliship/ws";

    return ADDRESS
}());

module.exports= ADDRESS;
