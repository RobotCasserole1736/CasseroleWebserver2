import { dflt_options, dflt_y_axis_cfg, dflt_x_axis_cfg } from './plotDefaultConfig.js'


export class Plot {


    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(drawDiv_in) { 

        //Save off a reference to the relevant div
        this.drawDiv = drawDiv_in;

        this.mainTable = document.createElement('table');
        this.mainTable.classList.add("expand");
        this.mainTable.classList.add("outlined");

        var tableRow = this.mainTable.insertRow();
        this.chartTableElem = tableRow.insertCell();
        this.signalListElem = tableRow.insertCell();

        this.signalListTable = document.createElement('table');
        this.signalListTable.classList.add("plotSignalTable");
        this.signalListTable.classList.add("outlined");


        this.signalListElem.appendChild(this.signalListTable);


        var chartDrawElemId = this.drawDiv.id + "_chart";
        var signalListElemId = this.drawDiv.id + "_siglist";

        this.chartTableElem.id = chartDrawElemId;


        this.drawDiv.appendChild(this.mainTable);

        //deep-copy the default chart options
        var options = dflt_options;
        //Modify as needed
        options.chart.renderTo = chartDrawElemId;
        //Create highcharts object
        this.chart = new Highcharts.Chart(options);



    }

    resize(plotHeight, plotWidth){

        this.signalListTable.style.height = plotHeight.toString() + "px";
        this.signalListTable.style.width = "200px"

        //Highcharts does not automatically flow to fill its container - this will do that manually.
        this.chart.setSize(plotWidth - 200, plotHeight);
        this.chart.reflow();
        this.chart.redraw();
    }
}
