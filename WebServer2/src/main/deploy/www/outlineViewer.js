
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




function topicAnnounceHandler( newTopic ) {
    console.log("----------------------------");
    console.log("Topic Announced");
    console.log(newTopic.name);
    console.log(newTopic.type);
    console.log(newTopic.id);
}

function topicUnannounceHandler( removedTopic ) {
    console.log("----------------------------");
    console.log("Topic UnAnnounced");
    console.log(removedTopic.name);
}

function valueUpdateHandler( topic, timestamp_us, value ) {
    console.log("----------------------------");
    console.log("Values Updated");
    console.log(topic.name);
    console.log(timestamp_us);
    console.log(value);
}

function onConnect() {
    console.log("Connected to Server");
}

function onDisconnect() {
    console.log("Disconnected from Server");
}
