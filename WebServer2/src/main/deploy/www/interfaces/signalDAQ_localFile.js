/////////////////////////////////////////////////////////////////////////
// SignalDAQLocalFile - reads and announces signal data through the same
// interface as the NT4 signals
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

export class SignalDAQLocalFile {


    constructor(onSignalAnnounce_in,   //Gets called when a new signal is found in the file
                onSignalUnAnnounce_in, //Gets called when a signal is no longer avaialble.
                onNewSampleData_in,    //Gets called when any new piece of data is read from file
                onConnect_in,          //Gets called once a file is loaded into RAM
                onDisconnect_in) {     //Gets called once a file is unloaded.
        this.onSignalAnnounce = onSignalAnnounce_in;
        this.onSignalUnAnnounce = onSignalUnAnnounce_in;
        this.onNewSampleData = onNewSampleData_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        this.signalNameList = []; //start assuming no signals.

    }

    load(fileobj){
        var reader = new FileReader();
        reader.readAsText(fileobj);
        reader.onload = this.parseFileContents.bind(this);
    }

    parseFileContents(evt){
        var all_lines = evt.target.result + '';
        var lines = all_lines.split('\n');

        if(lines.length > 3){
            this.parseHeaders(lines[0], lines[1]);
            for(var lineIdx = 2; lineIdx < lines.length; lineIdx++){
                this.parseData(lines[lineIdx]);
            }
        } else {
            throw("Could not parse file! Not enough lines of content.");
        }
    }

    parseHeaders(nameRow, unitsRow){
        var nameList = nameRow.split(',');
        var unitsList = unitsRow.split(',');

        if(nameList.length == unitsList.length){
            for(var sigIdx = 1; sigIdx < nameList.length; sigIdx++){
                this.signalNameList.push(nameList[sigIdx]);
                this.onSignalAnnounce(nameList[sigIdx], unitsList[sigIdx]); 
            }
        } else {
            throw("Could not parse file! Number of signal names and units is not the same.");
        }
    }

    parseData(row){
        var dataValuesList = row.split(',');
        if(dataValuesList.length == (this.signalNameList.length + 1)){
            var timestamp = eval(dataValuesList[0]);
            for(var sigIdx = 0; sigIdx < this.signalNameList.length; sigIdx++){
                var dataValStr = dataValuesList[sigIdx + 1].trim();
                if(dataValStr.length > 0){
                    //Some data elements may be empty
                    this.onNewSampleData(this.signalNameList[sigIdx], timestamp, eval(dataValStr));
                }
            }

        } else {
            throw("Could not parse file! Number of data element in row does not match headers!");
        }
    }

    //Do-nothing functions
    startDAQ(){}
    stopDAQ(){}

    sigNameToValueTopic(name){
        return "Signals/" + name + "/Value"
    }

}