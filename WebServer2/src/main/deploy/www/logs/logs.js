import { LogTile } from "./logTile.js";

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////
var port = "5805";
var hostname = window.location.hostname + ":" + port;

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
    var ws = new WebSocket("ws://" + hostname + "/logData");
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
                logTilesMap[lf["shortName"]] = new LogTile(new_tr, lf["shortName"], lf["size_bytes"], lf["filePath"]);
                mainTable.appendChild(new_tr);
            });
        }


    };

    ws.onclose = function (e) {
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