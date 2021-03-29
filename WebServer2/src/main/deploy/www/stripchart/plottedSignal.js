/////////////////////////////////////////////////////////////////////////
// PlottedSignal - A signal, plus additional info for drawing it
// nicely. Includes info for drawing the info next to the plot in a
// table-like thing.
/////////////////////////////////////////////////////////////////////////

export class PlottedSignal {

    constructor(signal_in, initial_color, valueAxis_in, drawDiv_in) { 
        this.signal = signal_in;
        this.colorStr = initial_color; //Hex String
        this.drawDiv = drawDiv_in;

        this.selected = false;

        this.valueAxis = valueAxis_in;

        // Draw textual value display
        this.drawDiv.classList.add("plottedSignalInfo");
        this.drawDiv.setAttribute('draggable', true);
        this.drawDiv.addEventListener( "dragstart", this.onDragStart.bind(this) );
        this.drawDiv.addEventListener( "mouseup", this.onMouseUp.bind(this) );

        var nameInfo = document.createElement("plottedSignalName");
        nameInfo.innerHTML = signal_in.name;
        this.drawDiv.appendChild(nameInfo);

        var unitsInfo = document.createElement("plottedSignalUnits");
        unitsInfo.innerHTML = signal_in.units;
        this.drawDiv.appendChild(unitsInfo);

        this.valueInfo = document.createElement("plottedSignalValue");
        this.valueInfo.innerHTML = "----";
        this.drawDiv.appendChild(this.valueInfo);

        this.drawDiv.style.color = this.colorStr;
    }

    autoScale(startTime, endTime){
        var sampleList = this.signal.getSamples(startTime, endTime);
        this.valueAxis.autoScale(sampleList);
    }

    getSamples(startTime, endTime){
        var sampleList = this.signal.getSamples(startTime, endTime);
        return sampleList;
    }

    showValueAtTime(time_in){
        var sample = null;

        if(time_in == null){
            sample = this.signal.getLatestSample();
        } else {
            sample = this.signal.getSample(time_in);
        }

        if(sample != null){
            if (typeof sample.value === "number") {
                this.valueInfo.innerHTML = sample.value.toPrecision(4);
            } else {
                this.valueInfo.innerHTML = sample.value.toString();
            }
        } else {
            this.valueInfo.innerHTML = "----";
        }

        if(this.selected){
            this.drawDiv.classList.add("selectedText");
        } else {
            this.drawDiv.classList.remove("selectedText");
        }
    }

    onDragStart = e => {
        e.dataTransfer.setData('text/plain', this.signal.name);
    }

    onMouseUp = e => {
        this.selected = !this.selected;
    }

}