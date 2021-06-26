package frc.lib.miniNT4.samples;

import java.io.IOException;

import frc.lib.miniNT4.TimeserverClient;

public class Timestamp extends TimestampedValue {

    public Timestamp(){
    }

    @Override 
    protected void pack() throws IOException{
        this.timestamp_us = TimeserverClient.getCurServerTime();
        packer.packLong(this.timestamp_us);
    }

    
}
