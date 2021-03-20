/////////////////////////////////////////////////////////////////////////
// PlottedSignal - A signal, plus additional info for drawing it
// nicely
/////////////////////////////////////////////////////////////////////////

export class PlottedSignal {

    constructor(signal_in, initial_color) { 
        this.signal = signal_in;
        this.colorStr = initial_color; //Hex String
    }

}