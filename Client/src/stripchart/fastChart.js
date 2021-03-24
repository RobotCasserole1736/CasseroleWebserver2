
export class FastChart {
    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(drawContainer_in) { 

        this.startTime = 0;
        this.endTime = 1;

        this.yMin = 0;
        this.yMax = 1;
        
        this.cursorTime = null;

        // Set up drawing canvas within provided div
        this.drawContainer = drawContainer_in;
        this.drawDiv = document.createElement('chartDrawDiv');
        this.drawContainer.appendChild(this.drawDiv);
        this.canvas = document.createElement('canvas');
        this.canvas.id     = this.drawDiv.id + "_canvas";
        this.drawDiv.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }


    setTimeRange(startTime_in, endTime_in){
        this.startTime = startTime_in;
        this.endTime = endTime_in;
    }

    clearDrawing(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //////////////////////////////////////
    // Private, Helper methods
    //////////////////////////////////////

    recalcDrawConstants(){
        this.canvas.width  = this.drawContainer.clientWidth;
        this.canvas.height = this.drawContainer.clientHeight;

        //Drawing configurations

        this.AXIS_MARGIN = 25;

        this.plotOriginX_px = Math.round(this.AXIS_MARGIN);
        this.plotOriginY_px = Math.round(this.canvas.height - this.AXIS_MARGIN);

        this.xAxisLen_px = this.canvas.width - this.plotOriginX_px;
        this.yAxisLen_px = this.plotOriginY_px;

    }

    drawXMarkers(){
        this.getMarkerList(this.startTime, this.endTime, 5).forEach(markerTime => {
            var xPos = this.timeToX_px(markerTime);
            this.ctx.strokeStyle = "#555555";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, 0);
            this.ctx.lineTo(xPos, this.plotOriginY_px);
            this.ctx.stroke();

            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, this.plotOriginY_px);
            this.ctx.lineTo(xPos, this.canvas.height);
            this.ctx.stroke();

            this.ctx.font = "18px monospace";
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillText(markerTime.toPrecision(3), xPos + 2, this.plotOriginY_px + 2);
        });

    }

    drawYMarkers(yMin, yMax){
        //TODO
    }

    drawCursor(){
        if(this.cursorTime != null){
            var cursorPos = this.timeToX_px(this.cursorTime);
            this.ctx.strokeStyle = "#FFFF00";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(cursorPos, 0);
            this.ctx.lineTo(cursorPos, this.canvas.height);
            this.ctx.stroke();
        }
    }

    getMarkerList(min, max){
        var range = max - min;
        var orderOfMag = Math.pow(10.0, Math.floor(Math.log10(range)));
        var markerSpacing = 1;

        if (range / orderOfMag >= 5)
            markerSpacing = orderOfMag;
        else if (range / (orderOfMag / 2.0) >= 5)
            markerSpacing = orderOfMag / 2.0;
        else
            markerSpacing = orderOfMag / 5.0;

        var markerStart = Math.ceil(min / markerSpacing) * markerSpacing;
        var markerCur = markerStart;
        var markerList = [];

        while(markerCur < max){
            markerList.push(markerCur);
            markerCur += markerSpacing;
        }
        return markerList;
    }

    drawAxes(){
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        //X axis
        this.ctx.moveTo(this.plotOriginX_px,this.plotOriginY_px);
        this.ctx.lineTo(this.canvas.width, this.plotOriginY_px);

        //Y axis
        this.ctx.moveTo(this.plotOriginX_px, 0);
        this.ctx.lineTo(this.plotOriginX_px, this.plotOriginY_px);
        this.ctx.stroke();
    }

    drawSeries(sampleList, yMin, yMax, colorString_in){
        if(sampleList.length > 2){
            this.ctx.strokeStyle = colorString_in;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            var x_px = this.timeToX_px(sampleList[0].time);
            var y_px = this.valToY_px(sampleList[0].value, yMin, yMax);
            this.ctx.moveTo(x_px, y_px);
            for(var sampIdx = 1; sampIdx < sampleList.length; sampIdx++){
                x_px = this.timeToX_px(sampleList[sampIdx].time);
                y_px = this.valToY_px(sampleList[sampIdx].value, yMin, yMax);
                this.ctx.lineTo(x_px, y_px);
            }
            this.ctx.stroke();
        }
    }

    timeToX_px(time_in){
        var frac = (time_in - this.startTime)/(this.endTime - this.startTime);
        return this.plotOriginX_px + this.xAxisLen_px * frac;
    }

    valToY_px(val_in, yMin, yMax){
        var frac = (val_in - yMin)/(yMax - yMin);
        return this.plotOriginY_px - this.yAxisLen_px * frac; //Negative produces coordinate transform to pixel space
    }


  }