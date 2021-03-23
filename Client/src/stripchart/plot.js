/////////////////////////////////////////////////////////////////////////
// Plot - collection of the highcharts object, plus the table which
// shows signal names and values.
/////////////////////////////////////////////////////////////////////////


import { FastChart } from './fastChart.js';
import { PlottedSignal } from './plottedSignal.js';


export class Plot {

    constructor(drawDiv_in, signalFromNameCallback_in) { 

        //Save off a reference to the relevant div
        this.drawDiv = drawDiv_in;

        // Init the plotted signals list to be empty
        this.plottedSignalsList = [];

        // External ranges to synchronize all plots in terms of what they show 
        // and what actually needs drawn on the screen at any given time.
        this.drawStartTime = 0;
        this.drawEndTime = 0;
        this.viewStartTime = 0;
        this.viewEndTime = 0;

        //Each plot has has two side-by-side flex containers - one for highcharts (the actual plot window)
        // and one for the table of currently plotted signals.
        this.hcContainer = document.createElement('plotHighchartsContainer');
        this.hcContainer.id = this.drawDiv.id + "_hcContainer";
        this.psContainer = document.createElement('plotSignalInfoContainer');
        this.psContainer.id = this.drawDiv.id + "_psContainer";
        
        this.drawDiv.appendChild(this.hcContainer);
        this.drawDiv.appendChild(this.psContainer);

        //Configure the whole plot div to support signals dropped onto them.
        this.signalFromNameCallback = signalFromNameCallback_in; //supporting drop operation requires getting the actual signal object using only the name, which would come from the next architectural layer up. Yucky, but functional.
        this.drawDiv.addEventListener('dragenter', this.dragEnter)
        this.drawDiv.addEventListener('dragover', this.dragOver);
        this.drawDiv.addEventListener('dragleave', this.dragLeave);
        this.drawDiv.addEventListener('drop', this.drop);

        this.chart = new FastChart(this.hcContainer);

        this.DFLT_COLORS = ["#DD0000", "#00DD00", "#4444FF", "#DDDD00", "#DD00DD", "#00DDDD"];

    }

    setCursorPos(xPos){
        //TODO
    }

    drawDataToChart(){
        this.chart.recalcDrawConstants();
        this.chart.clearDrawing();
        this.chart.drawAxes();
        this.chart.setTimeRange(this.viewStartTime, this.viewEndTime);
        for(var sigIdx = 0; sigIdx < this.plottedSignalsList.length; sigIdx++){
            var ps = this.plottedSignalsList[sigIdx];
            var samples = ps.getSamplesWithPlotRangeUpdate(this.drawStartTime,this.drawEndTime);
            this.chart.drawSeries(samples, ps.lowerPlotRange, ps.upperPlotRange, ps.colorStr);
        }
        
    }



    addSignal(signal_in){

        //Reject duplicate adds
        var duplicate = false;
        this.plottedSignalsList.forEach(ps => {
            if(signal_in == ps.signal){
                duplicate = true;
            }
        })

        if(!duplicate){
            var color = this.DFLT_COLORS[this.plottedSignalsList.length % this.DFLT_COLORS.length];
            var newPltSigDiv = document.createElement("plottedSignalInfo");
            this.plottedSignalsList.push(new PlottedSignal(signal_in, color, newPltSigDiv));
            this.psContainer.appendChild(newPltSigDiv);
        }

    }

    removeSignal(signal_in){
        //TODO...maybe here... remove signal from both the highcharts and table?

        for(var idx = 0; idx < this.plottedSignalsList.length; idx++){
            if(signal_in == this.plottedSignalsList[idx].signal){
                this.plottedSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }
    }

    setDrawRange(startTime, endTime){
        this.drawStartTime = startTime;
        this.drawEndTime = endTime;
    }

    setViewRange(startTime, endTime){
        this.viewStartTime = startTime;
        this.viewEndTime = endTime;
    }

    ////////////////////////////////////////////
    // Main Animation Loop & utilities
    mainAnimationLoop(){

        this.drawDataToChart();
        this.updateDisplayedValues();
     }

    updateDisplayedValues(){
        this.plottedSignalsList.forEach(ps => {
            ps.showValueAtTime(null); //latest
        })
    }

    ////////////////////////////////////////////
    // Drag & Drop Handlers
    dragEnter = e => {
        e.preventDefault();
        this.drawDiv.classList.add('drag-over');
    }
    
    dragOver = e => {
        e.preventDefault();
        this.drawDiv.classList.add('drag-over');
    }
    
    dragLeave = e => {
        this.drawDiv.classList.remove('drag-over');
    }
    
    drop = e => {
        // get the draggable element
        e.preventDefault();
        const signalName = e.dataTransfer.getData('text/plain');
        this.addSignal(this.signalFromNameCallback(signalName));
        this.drawDiv.classList.remove('drag-over');
    }

}
