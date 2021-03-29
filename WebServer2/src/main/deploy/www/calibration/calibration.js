
//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////

import { CalTile } from "./calTile.js";
import { Calibration_NT4 } from "../interfaces/calibration_NT4.js";

var calTilesMap = new Map();
var mainTable = document.getElementById("calValueTable");

var calInf = new Calibration_NT4(onCalAnnounce, onCalUnAnnounce,onCalValueChange,onConnect,onDisconnect);

// Start up rendering (never returns)

//////////////////////////////////////////////////
// Render & Animation Loop Functions
//////////////////////////////////////////////////

window.resetAll = resetAll;
function resetAll(){
    calTilesMap.forEach(cal => cal.reset());
}

// Re-filter the calibrations shown to the user by a new spec
window.filterChangeHandler = filterChangeHandler;
function filterChangeHandler(filterSpec_in){
    var filterSpec = filterSpec_in.toLowerCase();

    if(filterSpec.length == 0 ){ //no filter, show all
        calTilesMap.forEach(cal => cal.show());
    } else { //Filtering, do the inclusion check
        calTilesMap.forEach(cal => {
            if(cal.name.toLowerCase().includes(filterSpec)){
                cal.show();
            } else {
                cal.hide();
            }
        });
    }
}

function onCalAnnounce(name_in, units_in, min_in, max_in, default_in){
    var new_tr = document.createElement("tr");
    calTilesMap[name_in] = new CalTile(new_tr, name_in, units_in, min_in, max_in, default_in);
    mainTable.appendChild(new_tr);

}

function onCalUnAnnounce(name_in){
    var trToRemove = calTilesMap[name_in].drawDiv;
    mainTable.removeChild(trToRemove);
    calTilesMap.delete(name_in);

}

function onCalValueChange(name_in, value_in){
    mainTable[name_in].setVal(value_in);
}

function onConnect(){
    calTilesMap.clear();
}

function onDisconnect(){

}