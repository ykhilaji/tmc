"use strict";

var MessageTypes = (function () {
    function MessageTypes() {
        throw new Error('Static Class');
    }
    MessageTypes.LP_CONNECTION_INIT = 'connection_init'; // Client -> Server
    MessageTypes.LP_CONNECTION_ERROR = 'connection_error'; // Client -> Server
    MessageTypes.LP_CONNECTION_TERMINATE = 'connection_end'; // Client -> Server
    MessageTypes.LP_CONNECTION_ACK = 'connection_ack'; // Server -> Client
    // NOTE: The keep alive message type does not follow the standard due to connection optimizations
    MessageTypes.LP_CONNECTION_KEEP_ALIVE = 'ka'; // Server -> Client
    MessageTypes.LP_DATA_PRINTER = "printer" // Server <- Client
    MessageTypes.LP_CONNECTION_KEEP_ALIVE_INFO = 'kap'; // Server -> Client
    MessageTypes.LP_DATA = 'data'; // Server -> Client
    MessageTypes.LP_DATA_INFO = 'data_info' // Server -> Client
    MessageTypes.LP_REFRESH = 'refresh'; // Server <- Client
    MessageTypes.LP_REFRESH_CA = 'refresh_ca'; // Server <- Client
    MessageTypes.WS_SESSION_ACK = "session_ack"; // Server -> Client

    MessageTypes.LP_ALERTE_MSG = "alert_msg" // Server <- Client

    return MessageTypes;
}());

module.exports = MessageTypes;

//# sourceMappingURL=message-types.js.map