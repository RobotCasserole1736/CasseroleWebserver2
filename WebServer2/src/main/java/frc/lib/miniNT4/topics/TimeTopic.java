package frc.lib.miniNT4.topics;

import frc.lib.miniNT4.NT4Types;
import frc.lib.miniNT4.samples.Timestamp;

public class TimeTopic extends Topic{

    public TimeTopic() {
        super("Server Time", new Timestamp());
        id = -1; // Hardcode ID for time
    }

    @Override
    public String getTypestring() {
        return NT4Types.FLOAT_64.dtstr;
    }

    @Override
    public int getTypeInt() {
        return NT4Types.FLOAT_64.type_idx;
    }
    
}
