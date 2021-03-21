/////////////////////////////////////////////////////////////////////////
// Signal Selector - allows the user to select which signals they
// want recorded.
/////////////////////////////////////////////////////////////////////////

import { SelectableSignal } from "./selectableSignal.js";

export class SignalSelector {

    LOCAL_STORAGE_KEY_NAME = "CasseroleStripchartSelSig";

    constructor(drawDiv_in) { 
        this.selectableSignalsList = [];
        this.drawDiv = drawDiv_in;

        this.local_storage_available = false;
        if (typeof(Storage) !== "undefined") {
            this.local_storage_available = true;
        } 
    }

    // Add a new signal to the selector list
    addSignal(signal_in){
        var newSelSigDiv = document.createElement("button");
        this.selectableSignalsList.push(new SelectableSignal(signal_in,newSelSigDiv));
        this.drawDiv.appendChild(newSelSigDiv);
    }

    // Remove signal from selector list
    removeSignal(signal_in){
        for(var idx = 0; idx < this.selectableSignalsList.length; idx++){
            if(signal_in == this.selectableSignalsList[idx].signal){
                this.drawDiv.removeChild(this.selectableSignalsList[idx].drawDiv);
                this.selectableSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }
    }

    clearSignalList(){
        this.selectableSignalsList = [];
    }

    attemptSignalSelectionRestore(){
        //Attempt to read a list of signal names out of local storage that were
        // previously selected.
        var ls_sel_signals = [];
        if(this.local_storage_available == true){
            ls_sel_signals = JSON.parse(localStorage.getItem(SignalSelector.LOCAL_STORAGE_KEY_NAME))
            if(ls_sel_signals == null){
                ls_sel_signals = [];
            }
        }
        ls_sel_signals.forEach(sigName => {
            this.selectableSignalsList.forEach(selSig => {
                if(sigName.localeCompare(selSig.signal.name) == 0 ){
                    selSig.select();
                }
            })
        });
    }

    updateStoredSignalSelection(){
        //Update local storage with list of currently selected signals
        if(this.local_storage_available){
            var ls_sel_signals = [];
            this.getSelectedSignalList().forEach(selSig =>{
                ls_sel_signals.push(selSig.name);
            })
            localStorage.setItem(SignalSelector.LOCAL_STORAGE_KEY_NAME, JSON.stringify(ls_sel_signals));
        }
    }

    //Get all currently-selected signals
    getSelectedSignalList(){
        var retList = [];

        this.selectableSignalsList.forEach(ssig => {
            if(ssig.isSelected){
                retList.push(ssig.signal);
            }
        });

        return retList;
    }

    // Re-filter the signals shown to the user by a new spec
    setFilterSpec(filterSpec_in){
        var filterSpec = filterSpec_in.toLowerCase();

        if(filterSpec.length == 0 ){ //no filter, show all
            this.selectableSignalsList.forEach(ssig => ssig.show());
        } else { //Filtering, do the inclusion check
            this.selectableSignalsList.forEach(ssig => {
                if(ssig.signal.name.toLowerCase().includes(filterSpec)){
                    ssig.show();
                } else {
                    ssig.hide();
                }
            });
        }
    }

    clearSelection(){
        this.selectableSignalsList.forEach(ssig => ssig.unselect());
    }

    enableUserInteraction(){
        this.selectableSignalsList.forEach(ssig => ssig.enable());
    }

    disableUserInteraction(){
        this.selectableSignalsList.forEach(ssig => ssig.disable());
    }

}