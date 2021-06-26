package frc.lib.miniNT4.samples;

import java.io.IOException;

public class TimestampedString extends TimestampedValue {
    String value;

    public TimestampedString(String value, long time){
        this.value = value;
        this.timestamp_us = time;
    }

    @Override 
    protected void pack() throws IOException{
        packer.packString(value);
    }

    
}
