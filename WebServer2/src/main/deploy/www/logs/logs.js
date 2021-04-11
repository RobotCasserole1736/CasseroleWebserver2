import { LogTile } from "./logTile.js";

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////
var hostname = window.location.hostname + ":" + window.location.port;
var ws = null;


var logTilesMap = new Map();
var mainTable = document.getElementById("logListingTable");
var connectionStatusDiv = document.getElementById("connectionStatusDiv");
var statusDiv = document.getElementById("statusDiv");


connect();


//////////////////////////////////////////////////
// Render & Display Update Functions
//////////////////////////////////////////////////
function clearDisplayedLogs() {
    var newMainTable = document.createElement('table');
    newMainTable.classList.add("outlined");
    var parent = mainTable.parentNode;
    if(parent != null){
        mainTable.parentNode.replaceChild(newMainTable, mainTable); //Stackoverflow says this is how to clear a table easily.
        logTilesMap.clear();
    }
    mainTable = newMainTable;

    //Add headers
    var new_tr = document.createElement("tr");
    var new_th = document.createElement("th");
    new_th.innerHTML = "File";
    new_tr.appendChild(new_th);
    var new_th = document.createElement("th");
    new_th.innerHTML = "Size (B)";
    new_tr.appendChild(new_th);
    mainTable.appendChild(new_tr);
}

function connect() {
    ws = new WebSocket("ws://" + hostname + "/logData");
    ws.onopen = function () {
        clearDisplayedLogs();
        connectionStatusDiv.innerHTML = "Connected";
        connectionStatusDiv.classList.remove("disconnected");
        connectionStatusDiv.classList.add("connected");
        statusDiv.innerHTML = "";
    };

    ws.onmessage = function (e) {

        var msg = JSON.parse(e.data);

        if (msg["type"] == "new_log_file_list") {
            clearDisplayedLogs();
            msg["files"].forEach(lf => {
                var new_tr = document.createElement("tr");
                new_tr.classList.add("logFileRow");
                logTilesMap[lf["shortName"]] = new LogTile(new_tr, lf["shortName"], lf["size_bytes"], lf["filePath"], sendCmd);
                mainTable.appendChild(new_tr);
            });
        } else if (msg["type"] == "zip_ready") {
            var cleanedPath = msg["path"].replace(/^[\.\/\\]+/, '').replace(/\\/g, "/");
            var zipLocation = "http://" + hostname + "/" +cleanedPath;
            window.open(zipLocation);
        } else if (msg["type"] == "status") {
            statusDiv.innerHTML = msg["string"];
        }
    };

    ws.onclose = function (e) {
        ws = null;
        connectionStatusDiv.innerHTML = "Disconnected...";
        connectionStatusDiv.classList.remove("connected");
        connectionStatusDiv.classList.add("disconnected");
        statusDiv.innerHTML = "";
        clearDisplayedLogs();
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };

    ws.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

function sendCmd(cmd_in){
    if(ws != null){
        ws.send(JSON.stringify(cmd_in));
    }
}

window.deleteAll=deleteAll;
function deleteAll(){
    if(confirm("This will delete ALL log files, are you sure?")){
        sendCmd({cmd:"deleteAll"});
    }
}

window.downloadAll=downloadAll;
function downloadAll(){
    sendCmd({cmd:"downloadAll"});
}