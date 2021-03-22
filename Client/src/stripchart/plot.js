/////////////////////////////////////////////////////////////////////////
// Plot - collection of the highcharts object, plus the table which
// shows signal names and values.
/////////////////////////////////////////////////////////////////////////


import { dflt_options, dflt_y_axis_cfg, dflt_x_axis_cfg } from './highChartDefaultConfigs.js'
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

        //Highcharts object likes to be fixed height, which plays poorly with the flex layout we're wanting
        // Wrap it in a abs-pos div so it won't drive a dimension into its container.
        // Separately, in the resize() function, we'll manually adjust the highchart object size
        // to match the container.
        this.hcRelDiv = document.createElement('div');
        this.hcRelDiv.classList.add("HCAbsPosDiv");
        this.hcRelDiv.id = this.drawDiv.id + "_hcRelDiv"
        
        
        this.hcContainer.appendChild(this.hcRelDiv);
        this.drawDiv.appendChild(this.hcContainer);
        this.drawDiv.appendChild(this.psContainer);

        //Configure the whole plot div to support signals dropped onto them.
        this.signalFromNameCallback = signalFromNameCallback_in; //supporting drop operation requires getting the actual signal object using only the name, which would come from the next architectural layer up. Yucky, but functional.
        this.drawDiv.addEventListener('dragenter', this.dragEnter)
        this.drawDiv.addEventListener('dragover', this.dragOver);
        this.drawDiv.addEventListener('dragleave', this.dragLeave);
        this.drawDiv.addEventListener('drop', this.drop);

        //copy the default chart options
        var options = dflt_options;
        //Modify as needed
        options.chart.renderTo = this.hcRelDiv.id; 
        //Create highcharts object
        this.chart = new Highcharts.Chart(options);

    }

    resize(){
        var plotHeight = this.hcContainer.clientHeight;
        var plotWidth = this.hcContainer.clientWidth;

        //Highcharts does not automatically flow to fill its container, so we do that here.
        this.chart.setSize(plotWidth, plotHeight);
        this.chart.reflow();
    }

    setCursorPos(xPos){
        //TODO
    }

    drawDataToChart(){
        for(var sigIdx = 0; sigIdx < this.plottedSignalsList.length; sigIdx++){
            var ps = this.plottedSignalsList[sigIdx];
            var samples = ps.signal.getSamples(ps.prevMaxTime,this.drawEndTime);
            var removeFirstSample = false;
            if(samples.length > 0 && samples[0].time < this.drawStartTime){
                removeFirstSample = true;
            }
            samples.forEach(sample => {
                this.chart.series[sigIdx].addPoint([sample.time,sample.value],false,removeFirstSample,true);
            });

            ps.prevMaxTime = this.drawEndTime;
        }

        this.chart.xAxis[0].setExtremes(this.viewStartTime, this.viewEndTime,false)
        //Actual chart redraw handled in animation loop.
        
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
            var newPltSigDiv = document.createElement("plottedSignalInfo");
            this.plottedSignalsList.push(new PlottedSignal(signal_in, "#FF0000", newPltSigDiv));
            this.psContainer.appendChild(newPltSigDiv);
    
            //submit new series to highcharts
            var hcYAxisCfg = dflt_y_axis_cfg;
            var hcSeriesCfg = dflt_x_axis_cfg;

            hcYAxisCfg.title.text = signal_in.units;
            hcSeriesCfg.name = signal_in.name;
            hcSeriesCfg.yAxis = this.plottedSignalsList.length-1; //TODO - make this not 1-for-1 with series

            this.chart.addAxis(hcYAxisCfg, false, false, false);
            this.chart.addSeries(hcSeriesCfg, false, false);
        }

        this.resize();

    }

    removeSignal(signal_in){
        //TODO...maybe here... remove signal from both the highcharts and table?

        for(var idx = 0; idx < this.plottedSignalsList.length; idx++){
            if(signal_in == this.plottedSignalsList[idx].signal){
                this.plottedSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }

        this.resize();

    }

    clearChartData(){
        this.chart.series.forEach(series => series.setData([],false, false, false))
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
        this.chart.redraw();
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
