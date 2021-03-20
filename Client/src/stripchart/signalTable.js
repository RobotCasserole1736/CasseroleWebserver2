/////////////////////////////////////////////////////////////////////////
// Signal Table - Displays all plotted signals and their values 
// in a table. Also.... lets you pick a new color for the signal?
/////////////////////////////////////////////////////////////////////////


export class SignalTable {

    constructor(drawDiv_in) { 

        //Save off a reference to the relevant div
        this.drawDiv = drawDiv_in;

        this.mainTable = document.createElement("table");
        this.mainTable.classList.add("expand");

        this.drawDiv.appendChild(this.mainTable);

        this.plottedSignalList = [];

    }

    addSignal(plottedSignal_in){

    }

    removeSignal(plottedSignal_in){

    }

    updateValsForTime(time_in){

    }


}