import { NT4_Client } from "../interfaces/nt4.js";


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

var table = document.getElementById("mainTable");

var subscription = null;

function topicAnnounceHandler( newTopic ) {
    console.log("----------------------------");
    console.log("Topic Announced");
    console.log(newTopic.name);
    console.log(newTopic.type);
    console.log(newTopic.id);

    var newRow = table.insertRow();
    newRow.insertCell(0).innerHTML = newTopic.name;
    newRow.insertCell(1).innerHTML = newTopic.type;
    
    var valCell = newRow.insertCell(2);
    valCell.innerHTML = "";
    valCell.id = newTopic.name;

    subscribeToAll();

}

function topicUnannounceHandler( removedTopic ) {
    console.log("----------------------------");
    console.log("Topic UnAnnounced");
    console.log(removedTopic.name);
}

function valueUpdateHandler( topic, timestamp_us, value ) {
    document.getElementById(topic.name).innerHTML = value;
    document.getElementById("curTime").innerHTML = "Time: "
    document.getElementById("curTime").innerHTML += (timestamp_us / 1000000.0);
    //console.log("----------------------------");
    //console.log("Values Updated");
    //console.log(topic.name);
    //console.log(timestamp_us);
    //console.log(value);
}

function onConnect() {
    console.log("Connected to Server");
    var titleRow = table.insertRow(0);
    titleRow.insertCell(0).innerHTML = "Name";
    titleRow.insertCell(1).innerHTML = "Type";
    titleRow.insertCell(2).innerHTML = "Value";
}

function onDisconnect() {
    console.log("Disconnected from Server");
    table.innerHTML = "";
    subscription = null;
}


function subscribeToAll() {
    if(subscription == null){
        subscription = nt4Client.subscribePeriodic("/", 0.02);
    }

}