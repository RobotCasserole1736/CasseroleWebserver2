/////////////////////////////////////////////////////////////////////////
// Signal - A set of samples with monotomically-increasing time.
/////////////////////////////////////////////////////////////////////////

export class Signal {

    constructor(name_in, units_in) { 
        this.name = name_in;
        this.units = units_in;
        this.sampleList = []; //Assumed to be entered in monotomically-increasing order?
        this.latestSampleTime = 0;
    }

    //Add a new sample to the signal 
    addSample(newSample){
        this.sampleList.push(newSample); //Assume they come in monotomically increasing?
        this.latestSampleTime = newSample.time;
    }

    //Get all samples in a given time range. Might return empty if no samples present
    getSamples(startTime, endTime){
        var retList = [];

        this.sampleList.forEach(sample => {
            if(sample.time >= startTime && sample.time <= endTime){
                retList.push(sample);
            } 
        });

        return retList;
    }

    //Return the first sample at or after the given time.
    //Might return null if no sample is after given time.
    getSample(time_in){
        var retSample = null;
        this.sampleList.forEaach(sample =>{
            if(sample.time >= time_in){
                retSample = sample;
            }
        });
        return retSample;
    }

    //Clear out all samples
    clearValues(){
        this.sampleList = [];
    }

    //Return the most-recently-added sample
    //Might return null if no sample has been added yet.
    getLatestSample(){
        if(this.sampleList.length > 0){
            return this.sampleList[this.sampleList.length-1];
        } else {
            return null;
        }
    }

}