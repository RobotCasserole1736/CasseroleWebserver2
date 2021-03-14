
export class Icon {

    static kOFF = 0;
    static kON  = 1;
    static kBLINK  = 2;

    static blinkPeriodLoops = 60;
    static blinkDC = 0.6;

    //////////////////////////////////////
    // Public Class methods
    //////////////////////////////////////
    constructor(draw_div_id, title, color_on, color_off, icon) { 
        this.draw_div_id = draw_div_id;
        this.title = title;
        this.color_on = color_on;
        this.color_off = color_off;
        this.icon = icon;
        
        // State Variable Defaults
        this.hasData = false;
        this.curState = 0;
        this.blinkCounter = 0;

        this.docElem = document.getElementById(draw_div_id);
        this.docElem.setAttribute("data-tooltip", this.title);
    }

    // Call this when NT is disconnected, or data is otherwise not available
    reportNoData(){
        this.hasData = false;
        this.curState = kOFF;
    }

    // Call this whenever a new state for the widget is available.
    setVal(state) { 
        this.curState = state;
        this.hasData = true;
    }

    //Call once per render loop to redraw the gauge
    render() {

        // Pick the color based on the current state of the icon.
        var iconDrawColor = this.color_off;
  
        if(this.curState == Icon.kBLINK){
            //Pick on state for high enough counter values
            if(this.blinkCounter > (Icon.blinkPeriodLoops * (1.0-Icon.blinkDC))){
                iconDrawColor = this.color_on;
            } 

            //Reset counter at period
            if(this.blinkCounter > Icon.blinkPeriodLoops){
                this.blinkCounter = 0;
            } else {
                this.blinkCounter++;
            }

        } else {
            //Non-blink - just use the state to drive the icon color
            this.blinkCounter = 0;
            if(this.curState == Icon.kON){
                iconDrawColor = this.color_on;
            }
        }

        if(iconDrawColor != null){
            //Draw an icon with the specified color
            this.docElem.innerHTML = "<div style=\"background-color:" + iconDrawColor + ";mask:url("+ this.icon +")  no-repeat; mask-size: cover; width:100%;height:100%;position:relative\"></div>"
        } else {
            //Make the area blank
            this.docElem.innerHTML = "";
        }



    }

    //////////////////////////////////////
    // Private, Helper methods
    //////////////////////////////////////

  }