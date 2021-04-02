import { LogTile } from "./logTile.js";

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////
var hostname = window.location.hostname + ":" + window.location.port;
var ws = null;


var logTilesMap = new Map();
var mainTable = document.getElementById("logListingTable");
var statusDiv = document.getElementById("statusDiv");


connect();


//////////////////////////////////////////////////
// Render & Display Update Functions
//////////////////////////////////////////////////
function clearDisplayedLogs() {
    var newMainTable = document.createElement('table');
    var parent = mainTable.parentNode;
    if(parent != null){
        mainTable.parentNode.replaceChild(newMainTable, mainTable); //Stackoverflow says this is how to clear a table easily.
        logTilesMap.clear();
    }
    mainTable = newMainTable;
}

function connect() {
    ws = new WebSocket("ws://" + hostname + "/logData");
    ws.onopen = function () {
        clearDisplayedLogs();
        statusDiv.innerHTML = "Connected";
    };

    ws.onmessage = function (e) {
        console.log('Message:', e.data);

        var msg = JSON.parse(e.data);

        if (msg["type"] == "log_files") {
            clearDisplayedLogs();
            msg["log_files"].forEach(lf => {
                var new_tr = document.createElement("tr");
                logTilesMap[lf["shortName"]] = new LogTile(new_tr, lf["shortName"], lf["size_bytes"], lf["filePath"], sendCmd);
                mainTable.appendChild(new_tr);
            });
        } else if (msg["type"] == "zip_ready") {
            var cleanedPath = msg["path"].replace(/^[\.\/\\]+/, '').replace(/\\/g, "/");
            var zipLocation = "http://" + hostname + "/" +cleanedPath;
            window.open(zipLocation);
        }
    };

    ws.onclose = function (e) {
        ws = null;
        statusDiv.innerHTML = "Disconnected...";
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
    sendCmd({cmd:"deleteAll"});
}

window.downloadAll=downloadAll;
function downloadAll(){
    sendCmd({cmd:"downloadAll"});
}