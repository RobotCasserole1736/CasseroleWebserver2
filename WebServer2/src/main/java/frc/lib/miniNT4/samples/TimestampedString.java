package frc.lib.miniNT4.samples;

import java.io.IOException;

public class TimestampedString extends TimestampedValue {
    String value;

    @Override 
    protected void pack() throws IOException{
        packer.packString(value);
    }

    
}
