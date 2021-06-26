package frc.lib.miniNT4.samples;

import java.io.IOException;

import org.msgpack.core.MessageBufferPacker;
import org.msgpack.core.MessagePack;

abstract public class TimestampedValue{
    public long timestamp_us;
    MessageBufferPacker packer = MessagePack.newDefaultBufferPacker();

    abstract protected void pack() throws IOException;

    public byte[] toMsgPack() throws IOException {
        packer.clear();
        this.pack();
        packer.close();
        return packer.toByteArray();
    }

}