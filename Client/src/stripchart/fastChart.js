
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

        this.mouseoverAtTimeCallback = null; //expect to be set to a function by the top-level stripcharts functionality to sync all charts.

        this.zoomRangeDn = null;
        this.zoomRangeUp = null;

        this.zoomRangeUpdateCallback = null; //expect to be set to a function by the top-level stripcharts functionality to sync all charts.

        // Set up drawing canvas within provided div
        this.drawContainer = drawContainer_in;
        this.drawDiv = document.createElement('chartDrawDiv');
        this.drawContainer.appendChild(this.drawDiv);
        this.canvas = document.createElement('canvas');
        this.canvas.id     = this.drawDiv.id + "_canvas";
        this.drawDiv.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener('mousemove', this.mouseoverHandler.bind(this), false);
        this.canvas.addEventListener('mouseleave', this.mouseleaveHandler.bind(this), false);
        this.canvas.addEventListener('mouseup', this.mouseupHandler.bind(this), false);
        this.canvas.addEventListener('mousedown', this.mousedownHandler.bind(this), false);

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

        this.dataMarkerCircleRadius = this.canvas.height * 0.005;

    }

    drawXMarkers(){
        this.getTickMarkList(this.startTime, this.endTime, 5).forEach(markerTime => {
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

    setCursorPos(newTime){
        this.cursorTime = newTime;
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

    drawZoomBox(){
        if(this.zoomRangeDn != null && this.cursorTime != null){
            var zpx = this.timeToX_px(this.zoomRangeDn);
            var cpx = this.timeToX_px(this.cursorTime);
            this.ctx.fillStyle = "#333355";
            this.ctx.lineWidth = 0;
            this.ctx.moveTo(zpx, 0);
            this.ctx.lineTo(cpx, 0);
            this.ctx.lineTo(cpx, this.plotOriginY_px);
            this.ctx.lineTo(zpx, this.plotOriginY_px);
            this.ctx.lineTo(zpx, 0);
            this.ctx.fill();
        }
    }

    getTickMarkList(min, max){
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
                //this.ctx.lineTo(x_px, y_px); //uncomment to make a step-chart
                y_px = this.valToY_px(sampleList[sampIdx].value, yMin, yMax);
                this.ctx.lineTo(x_px, y_px);
            }
            this.ctx.stroke();

            if(sampleList.length < 75 && Math.abs(sampleList[0].time - this.startTime) < 1.0){
                //Draw individual data point markers
                this.ctx.fillStyle = colorString_in;
                for(var sampIdx = 0; sampIdx < sampleList.length; sampIdx++){
                    x_px = this.timeToX_px(sampleList[sampIdx].time);
                    y_px = this.valToY_px(sampleList[sampIdx].value, yMin, yMax);
                    this.ctx.beginPath();
                    this.ctx.arc(x_px, y_px, this.dataMarkerCircleRadius, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }

        }
    }

    ///////////////////////////////////
    // Mouse-over cursor Handlers
    mouseoverHandler(e){
        if(this.mouseoverAtTimeCallback != null){
            var time = this.xPxToTime(e.x);
            if(time > this.startTime && time < this.endTime){
                this.mouseoverAtTimeCallback(time);
            } else {
                this.mouseoverAtTimeCallback(null);
            }
        }
    }

    mouseleaveHandler(e){
        if(this.mouseoverAtTimeCallback != null){
            this.mouseoverAtTimeCallback(null);
        }
        
        this.resetZoomRangeHandlers();

    }

    ///////////////////////////////////
    // Click-to-Zoom Handlers
    mousedownHandler(e){
        this.resetZoomRangeHandlers();

        //Save off the time where the user clicked down 
        var time = this.xPxToTime(e.x);
        if(time > this.startTime && time < this.endTime){
            this.zoomRangeDn = time;
        } 
    }

    mouseupHandler(e){
        //Save off the time where the user released
        var time = this.xPxToTime(e.x);
        if(time > this.startTime && time < this.endTime){
            this.zoomRangeUp = time;
        } else {
            this.zoomRangeUp = null;
        }

        if(this.zoomRangeDn != null && this.zoomRangeUp != null && this.zoomRangeDn != this.zoomRangeUp){
            //If this mouse-up produced a valid zoom range...
            var newZoomTimeStart = 0;
            var newZoomTimeEnd = 0;

            //order the up/down click points properly to range start/end
            if(this.zoomRangeDn < this.zoomRangeUp){
                newZoomTimeEnd = this.zoomRangeUp;
                newZoomTimeStart = this.zoomRangeDn;
            } else {
                newZoomTimeEnd = this.zoomRangeDn;
                newZoomTimeStart = this.zoomRangeUp;
            }

            //Execute callback to update charts as needed.
            if(this.zoomRangeUpdateCallback != null){
                this.zoomRangeUpdateCallback(newZoomTimeStart, newZoomTimeEnd);
            }
        }
        
        this.resetZoomRangeHandlers();

    }

    resetZoomRangeHandlers(){
        this.zoomRangeUp = null;
        this.zoomRangeDn = null;
    }

    ///////////////////////////////////
    // Pixel/time/value/units 
    xPxToTime(x_px_in){
        var frac = (x_px_in - this.plotOriginX_px)/(this.canvas.width- this.plotOriginX_px);
        return this.startTime + (this.endTime - this.startTime) * frac;
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