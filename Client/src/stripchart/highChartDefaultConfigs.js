/////////////////////////////////////////////////////////////////////////////////////
// HIGHCHARTS CONFIGURATION
/////////////////////////////////////////////////////////////////////////////////////

export var dflt_options =  {    

    credits: {
        enabled: false
    },

    chart: {
        type: 'line',
        height: 1, //Magical bogus value to let our resizing algorithm work properly. Do not touch.
        zoomType: 'x',
        renderTo: 'container',
        animation: false,
        ignoreHiddenSeries: true,
        resetZoomButton: {
            enabled: false,
        },
        enableMouseTracking: false, 
        stickyTracking: true, 
        shadow: false, 
        dataLabels: { style: { textShadow: false } },
        panning: true,
        panKey: 'shift',
        showAxes: true,
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, '#111111'],
                [1, '#181818']
            ]
        },
    },
    
    title: { 
        //disable title
        text: null,
    },
    
    xAxis: {
        type: 'linear',
        title: 'Time (sec)',
        lineColor: '#777',
        tickColor: '#444',
        gridLineColor: '#444',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#DDD',
                fontWeight: 'bold'
            },
        },
        title: {
            style: {
                color: '#D43',
            },
        },
    },
    
    yAxis: [],
    
    legend: {
        enabled: false,
    },
    
    exporting: {
        enabled: false
    },
    
    colors: ['#FF0000', '#0000FF', '#00FF00','#FF00FF', '#00FFFF', '#FFFF00'],

    plotOptions: {
        line: {
            marker: {
                radius: 2
            },
            lineWidth: 1,
            threshold: null,
            animation: false,
        }
    },
    tooltip: {
        enabled: false,
    },  

    series: []
}

/////////////////////////////////////////////////////////////////////////////////////
// AXIS CONFIGURATION
/////////////////////////////////////////////////////////////////////////////////////

export var dflt_y_axis_cfg = {    
    title:{
        text:"", //Populate with units, eventually
        style: {
            color: '#DDD',
        },
    }, 
    showEmpty:false,
    lineColor: '#777',
    tickColor: '#444',
    gridLineColor: '#444',
    gridLineWidth: 1,
    labels: {
        style: {
            color: '#DDD',
            fontWeight: 'bold'
        },
    },
}

export var dflt_x_axis_cfg = {name:"",
    data:[],
    visible:true,
    visibility_counter:0,
    yAxis:null,
    states: {
        hover: {
            enabled: false
        },
    },
    marker: {
        enabled: null
    },
   }