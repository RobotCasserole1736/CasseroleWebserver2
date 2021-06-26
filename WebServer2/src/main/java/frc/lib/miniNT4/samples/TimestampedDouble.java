package frc.lib.miniNT4.samples;

import java.io.IOException;

public class TimestampedDouble extends TimestampedValue {
    double value;

    @Override 
    protected void pack() throws IOException{
        packer.packDouble(value);
    }

    
}
