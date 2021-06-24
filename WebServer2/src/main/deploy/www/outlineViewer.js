
(function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }
})();

import { NT4_Client } from "./interfaces/nt4.js";


var nt4Client = new NT4_Client("localhost", 
                               topicAnnounceHandler,
                               topicUnannounceHandler,
                               valueUpdateHandler,
                               onConnect,
                               onDisconnect
                               );

console.log("Starting connection...");
nt4Client.ws_connect();
console.log("Connection Triggered");




function topicAnnounceHandler() {
    console.log("Topic Announced");
}

function topicUnannounceHandler() {
    console.log("Topic UnAnnounced");
}

function valueUpdateHandler() {
    console.log("Values Updated");
}

function onConnect() {
    console.log("On Connect");
}

function onDisconnect() {
    console.log("On Disconnect");
}
