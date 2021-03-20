/////////////////////////////////////////////////////////////////////////
// Selectable Signal- Individual signal with the ability for the user
// to check a box representing whether it should be selected or not,
// as well as click/drag to a chart. Draws as a clickable object on
// the given div.
/////////////////////////////////////////////////////////////////////////

export class SelectableSignal {

    constructor(signal_in, drawDiv_in) { 
        this.signal = signal_in;
        this.isSelected = false;
        this.drawDiv = drawDiv_in;
    }

}