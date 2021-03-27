
export class Text {

    static kOFF = 0;
    static kON  = 1;
    static kBLINK  = 2;

    static blinkPeriodLoops = 60;
    static blinkDC = 0.6;

    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(draw_elem_id, title_in, color_in) { 
        this.drawElemID = draw_elem_id;
        this.color = color_in;
        this.title = title_in;
        
        // State Variable Defaults
        this.reportNoData();

        this.drawElem = document.getElementById(this.drawElemID);
        this.drawElem.setAttribute("data-tooltip", this.title);

        //SVG Trick to get text to expand to fill the div
        // See https://css-tricks.com/fitting-text-to-a-container/#just-use-svg
        this.textElem= document.createElement("text");
        this.textElem.setAttribute("x", "0");
        this.textElem.setAttribute("y", "15");
        this.textElem.style.fontSize = "20px";


        this.svgElem = document.createElement("svg") ;
        this.svgElem.setAttribute("viewBox", "0 0 20 9");
        this.svgElem.style.width = "100%";
        this.svgElem.style.height = "100%";
        this.svgElem.style.position = "absolute";

        this.textHolderDiv = document.createElement("div");
        this.textHolderDiv.style.width = "100%";
        this.textHolderDiv.style.height = "100%";

        this.svgElem.appendChild(this.textElem);
        this.textHolderDiv.appendChild(this.svgElem);
        this.drawElem.appendChild(this.textHolderDiv);
    }

    // Call this when NT is disconnected, or data is otherwise not available
    reportNoData(){
        this.hasData = false;
        this.text = "****";
    }

    // Call this whenever a new state for the widget is available.
    setVal(textString) { 
        this.text = textString;;
        this.hasData = true;
    }

    //Call once per render loop to update and redraw the text area
    render() {
        this.textElem.innerHTML = this.text;
    }

    //////////////////////////////////////
    // Private, Helper methods
    //////////////////////////////////////

  }