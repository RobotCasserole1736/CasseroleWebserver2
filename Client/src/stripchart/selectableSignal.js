/////////////////////////////////////////////////////////////////////////
// Selectable Signal- Individual signal with the ability for the user
// to check a box representing whether it should be selected or not,
// as well as click/drag to a chart. Draws as a clickable object on
// the given div.
/////////////////////////////////////////////////////////////////////////

export class SelectableSignal {


    updateColor(){
        if(this.drawDiv.disabled){
            if(this.isSelected){
                this.drawDiv.style.background = "#BB3333";
                this.drawDiv.style.color = "#999999";
            } else {
                this.drawDiv.style.background = "#444444";
                this.drawDiv.style.color = "#999999";
            }
        } else {
            if(this.isSelected){
                this.drawDiv.style.background = "#FF2222";
                this.drawDiv.style.color = "#FFFFFF";
            } else {
                this.drawDiv.style.background = "#222222";
                this.drawDiv.style.color = "#FFFFFF";
            }
        }
    }

    constructor(signal_in, drawDiv_in) { 
        this.signal = signal_in;
        this.isSelected = false;
        this.drawDiv = drawDiv_in;

        this.drawDiv.classList.add("selectableSignal");
        this.drawDiv.addEventListener( "click", this.onclick );
        var dispText = signal_in.name;
        if(signal_in.units.length > 0){
            dispText += " (" + signal_in.units + ")";
        }
        this.drawDiv.innerHTML = dispText;
    }

    show(){
        this.drawDiv.style.display = "block";
    }

    hide(){
        this.drawDiv.style.display = "none";
    }

    enable(){
        this.drawDiv.disabled = false;
        this.updateColor();
    }

    disable(){
        this.drawDiv.disabled = true;
        this.updateColor();
    }


    onclick = e => {
        this.isSelected = !this.isSelected;
        this.updateColor();
    }

}