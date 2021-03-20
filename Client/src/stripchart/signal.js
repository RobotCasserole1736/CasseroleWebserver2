/////////////////////////////////////////////////////////////////////////
// Signal - A set of samples with monotomically-increasing time.
/////////////////////////////////////////////////////////////////////////

export class Signal {

    constructor(name_in, units_in) { 
        this.name = name_in;
        this.units = units_in;
        this.sampleList = []; //Assumed to be entered in monotomically-increasing order?
    }

    //Add a new sample to the signal 
    addSample(newSample){
        this.sampleList.push(newSample); //Assume they come in monotomically increasing?
    }

    //Get all samples in a given time range. Might return empty if no samples present
    getSamples(startTime, endTime){
        var retList = [];

        for(sample in this.sampleList){ //TODO - optimize me?
            if(sample.time >= startTime && sample.time <= endTime){
                retList.push(sample);
            } else if (sample.time > endTime ){
                break;
            }
        }

        return retList;
    }

    //Return the first sample at or after the given time.
    //Might return null if no sample is after given time.
    getSample(time_in){
        for(sample in this.sampleList){ //TODO - optimize me?
            if(sample.time >= time_in){
                return sample;
            }
        }
        return null;
    }

    //Clear out all samples
    clearValues(){
        this.sampleList = [];
    }

}