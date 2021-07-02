package frc.lib.miniNT4.samples;

import java.io.IOException;

import org.msgpack.core.MessageBufferPacker;

public class TimestampedInteger extends TimestampedValue {
    int value;

    public TimestampedInteger(int value, long time){
        this.value = value;
        this.timestamp_us = time;
    }

    @Override
    public String toNiceString() {
        return "{ Time=" + Long.toString(this.timestamp_us) + "us Value=" + Integer.toString(this.value) +"}";
    }

    @Override
    public void packValue(MessageBufferPacker packer) throws IOException {
        packer.packInt(value);
    }

    @Override
    public Integer getVal() {
        return value;
    }
    
}
