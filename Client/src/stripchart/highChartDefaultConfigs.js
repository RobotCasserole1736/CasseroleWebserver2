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
            position: {
                align: 'left',
            },
            theme: {
                fill: '#822',
                stroke: '#999',
                r: 3,
                style: {
                    color: '#999'
                },
                states: {
                    hover: {
                        fill: '#782828',
                        style: {
                            color: '#ccc'
                        },
                    },
                },
            },
        },
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
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 1,
        floating: true,
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: '#DDD'
        },
        itemHoverStyle:{
            color: 'gray'
        }  
        
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
        crosshairs: true,
        hideDelay: 0,
        shared: true,
        backgroundColor: null,
        snap: 30,
        borderWidth: 1,
        borderColor: '#FF0000',
        shadow: true,
        animation: false,
        useHTML: false,
        style: {
            padding: 0,
            color: '#D43',
        }
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