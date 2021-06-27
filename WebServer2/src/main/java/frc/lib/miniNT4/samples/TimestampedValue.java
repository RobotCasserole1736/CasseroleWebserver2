package frc.lib.miniNT4.samples;

import java.io.IOException;

import org.msgpack.core.MessageBufferPacker;

abstract public class TimestampedValue{
    public long timestamp_us;

    final long MAX_UINT = (long)Math.pow(2, 32) - 1;

    public int getTimestampAsUnsignedInt(){
        int retVal = 0;
        // insert mini rant here.
        if(timestamp_us < 0){
            // You were running your robot before you were running your robot?
            // No you weren't.
            retVal = 0;
        } else if (timestamp_us < Integer.MAX_VALUE) {
            retVal = (int) timestamp_us;
        } else if(timestamp_us <  MAX_UINT ) { //max unsigned integer
            // asdfasdfasdf 2's complement barf barf barf
            long tmp = MAX_UINT - timestamp_us + 1;
            tmp *= -1;
            retVal = (int) tmp;
        } else {
            // Robot code was running continuously for 1.2 hours
            // lolz nice try
            System.exit(0);
        }

        return retVal;
    }

    abstract public void packValue(MessageBufferPacker packer) throws IOException;

    abstract public String toNiceString();

}