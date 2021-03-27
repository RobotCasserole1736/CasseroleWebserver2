export class CalTile {

    constructor(drawDiv_in, name_in, units_in, min_in, max_in, default_in) { 

        this.name = name_in;
        this.units = units_in;
        this.min = min_in;
        this.max = max_in;
        this.default = default_in;
        this.drawDiv = drawDiv_in;

        this.curValue = default_in;

        this._addColumn(this.name);
        this._addColumn(this.units);
        this._addColumn(this.min);
        this._addColumn(this.max);
        this._addColumn(this.default);
        this.curValDiv = this._addColumn(this.curValue);
        this._addButtons(this.apply.bind(this), this.reset.bind(this));
    }

    show(){
        this.drawDiv.style.display = "block";
    }

    hide(){
        this.drawDiv.style.display = "none";
    }

    reset(){
        this.setVal(this.default);
    }

    apply(){
        //TODO
    }

    setVal(newVal){
        this.curValue = newVal;
        this._updateDisplayedValue();
    }

    _updateDisplayedValue(){
        this.curValDiv.innerHTML = this.curValue.toString();
    }

    _addColumn(text_in){
        var new_td = document.createElement("td");
        new_td.innerHTML = text_in;
        this.drawDiv.appendChild(new_td);
        return new_td;
    }

    _addButtons(applyCallback, resetCallback){
        var applyButton = document.createElement("button");
        applyButton.setAttribute("type", "button");
        applyButton.onclick = applyCallback;
        applyButton.innerHTML = "Apply";

        var resetButton = document.createElement("button");
        resetButton.setAttribute("type", "button");
        resetButton.onclick = resetCallback;
        resetButton.innerHTML = "Reset";

        var buttonDiv = document.createElement("div");
        var new_td = document.createElement("td");

        buttonDiv.appendChild(applyButton);
        buttonDiv.appendChild(resetButton);
        new_td.appendChild(buttonDiv);
        this.drawDiv.appendChild(new_td);
        return new_td;
    }

}