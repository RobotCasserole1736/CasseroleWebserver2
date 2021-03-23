
export class FastChart {
    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(drawContainer_in) { 

        this.startTime = 0;
        this.endTime = 1;

        this.minY = 0;
        this.maxY = 1;

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

        this.plotOriginX_px = Math.round(this.canvas.width*0.03);
        this.plotOriginY_px = Math.round(this.canvas.height*0.97);

        this.xAxisLen_px = this.canvas.width - this.plotOriginX_px;
        this.yAxisLen_px = this.plotOriginY_px;

    }

    drawAxes(){
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.beginPath();
        //X axis
        this.ctx.moveTo(0,this.plotOriginY_px);
        this.ctx.lineTo(this.canvas.width, this.plotOriginY_px);

        //Y axis
        this.ctx.moveTo(this.plotOriginX_px, 0);
        this.ctx.lineTo(this.plotOriginX_px, this.canvas.height);
        this.ctx.stroke();
    }

    drawSeries(sampleList, yMin, yMax, strokeStyle_in){
        if(sampleList.length > 2){
            this.ctx.strokeStyle = strokeStyle_in;
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

    valToY_px(val_in, minY, maxY){
        var frac = (val_in - minY)/(maxY - minY);
        return this.plotOriginY_px - this.yAxisLen_px * frac; //Negative produces coordinate transform to pixel space
    }


  }