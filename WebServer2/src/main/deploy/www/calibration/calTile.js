import { SpinBox } from "./spinbox/SpinBox.js";

export class CalTile {

    constructor(drawDiv_in, cal_in, valueSetCallback_in) { 

        this.cal = cal_in;
        this.drawDiv = drawDiv_in;
        this.valueSetCallback = valueSetCallback_in;

        this.spinbox = null;

        this._addColumn(this.cal.name);
        this._addColumn(this.cal.units);
        this._addColumn(this.cal.min);
        this._addColumn(this.cal.max);
        this._addColumn(this.cal.default);
        this.curValDiv = this._addColumn(this.cal.val);
        this._addControls(this.apply.bind(this), this.reset.bind(this));
    }

    show(){
        this.drawDiv.classList.remove("hidden");
    }

    hide(){
        this.drawDiv.classList.add("hidden");
    }

    reset(){
        this.setCalValue(this.default);
    }

    apply(){
        this.setCalValue(this.spinbox.getValue());
    }

    setCalValue(value){
        this.valueSetCallback(this.name, value);
    }

    // Updates the displayed "current value" of the calibration
    // Should be called whenever the server reports a new 
    // calibration value is available.
    updateCurValue(newVal){
        this._updateDisplayedValue();
    }

    _updateDisplayedValue(){
        this.curValDiv.innerHTML = this.cal.val.toString();

        if(this.cal.val != this.cal.default){
            this.curValDiv.classList.add("changed");
        } else {
            this.curValDiv.classList.remove("changed");  
        }
    }

    _addColumn(text_in){
        var new_td = document.createElement("td");
        new_td.classList.add("calText");
        new_td.innerHTML = text_in;
        this.drawDiv.appendChild(new_td);
        return new_td;
    }

    _addControls(applyCallback, resetCallback){

        var buttonDiv = document.createElement("div");
 
        var spinBoxContainer = document.createElement("div");
        spinBoxContainer.classList.add("spinBoxContainer");
        this.spinbox = new SpinBox(spinBoxContainer, {'minimum' : this.min, 'maximum' : this.max, 'decimals' : 1});
        buttonDiv.appendChild(spinBoxContainer);

        var applyButton = document.createElement("button");
        applyButton.setAttribute("type", "button");
        applyButton.onclick = applyCallback;
        applyButton.innerHTML = "Apply";
        buttonDiv.appendChild(applyButton);


        var resetButton = document.createElement("button");
        resetButton.setAttribute("type", "button");
        resetButton.onclick = resetCallback;
        resetButton.innerHTML = "Reset";
        buttonDiv.appendChild(resetButton);

        var new_td = document.createElement("td");
        new_td.appendChild(buttonDiv);
        this.drawDiv.appendChild(new_td);
        return new_td;
    }

}