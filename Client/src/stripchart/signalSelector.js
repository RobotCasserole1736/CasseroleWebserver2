/////////////////////////////////////////////////////////////////////////
// Signal Selector - allows the user to select which signals they
// want recorded.
/////////////////////////////////////////////////////////////////////////

import { SelectableSignal } from "./selectableSignal";

export class SignalSelector {

    constructor(drawDiv_in) { 
        this.selectableSignalsList = [];
    }

    // Add a new signal to the selector list
    addSignal(signal_in){
        this.selectableSignalsList.push(new SelectableSignal(signal_in,TODO));
    }

    removeSignal(signal_in){
        for(var idx = 0; idx < this.selectableSignalsList.length; idx++){
            if(signal_in == this.selectableSignalsList[idx]){
                this.selectableSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }
    }

    getSelectedSignalList(){
        var retList = [];

        for(selectableSignal in this.selectableSignalsList){
            if(selectableSignal.isSelected){
                retList.push(selectableSignal);
            }
        }

        return retList;

    }

}