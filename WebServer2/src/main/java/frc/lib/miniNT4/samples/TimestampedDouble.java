package frc.lib.miniNT4.samples;

import java.io.IOException;

public class TimestampedDouble extends TimestampedValue {
    double value;

    public TimestampedDouble(double value, long time){
        this.value = value;
        this.timestamp_us = time;
    }

    @Override 
    protected void pack() throws IOException{
        packer.packDouble(value);
    }

    
}
