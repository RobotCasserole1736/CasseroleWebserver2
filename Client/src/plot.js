import { dflt_options, dflt_y_axis_cfg, dflt_x_axis_cfg } from './plotDefaultConfig.js'


export class Plot {


    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(draw_div_id) { 

    //deep-copy the default chart options
    var options = dflt_options;
    
    //Modify as needed
    options.chart.renderTo = draw_div_id;

    //Create highcharts object
    this.chart = new Highcharts.Chart(options);


    }
}
