import { dflt_options, dflt_y_axis_cfg, dflt_x_axis_cfg } from './plotDefaultConfig.js'


export class Plot {


    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(drawDiv_in) { 

        //Save off a reference to the relevant div
        this.drawDiv = drawDiv_in;

        this.newHCContainer = document.createElement('plotHighchartsContainer');
        this.newHCContainer.id = this.drawDiv.id + "_hcContainer";
        this.newPSContainer = document.createElement('plotSignalTableContainer');
        this.newPSContainer.id = this.drawDiv.id + "_psContainer";
    
    
        this.drawDiv.appendChild(this.newHCContainer);
        this.drawDiv.appendChild(this.newPSContainer);

        //deep-copy the default chart options
        var options = dflt_options;
        //Modify as needed
        options.chart.renderTo = this.newHCContainer.id; //TODO
        //Create highcharts object
        this.chart = new Highcharts.Chart(options);



    }

    resize(){
        var plotHeight = this.newHCContainer.clientHeight;
        var plotWidth = this.newHCContainer.clientWidth;

        //Highcharts does not automatically flow to fill its container - this will do that manually.
        this.chart.setSize(plotWidth, plotHeight);
        this.chart.reflow();
        this.chart.redraw();
    }
}
