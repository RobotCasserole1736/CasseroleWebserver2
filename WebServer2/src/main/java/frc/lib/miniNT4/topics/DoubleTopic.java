package frc.lib.miniNT4.topics;

import frc.lib.miniNT4.NT4Types;
import frc.lib.miniNT4.samples.TimestampedDouble;

public class DoubleTopic extends Topic{

    public DoubleTopic(String name, double default_in) {
        super(name, new TimestampedDouble(default_in, 0));
    }

    @Override
    String getTypestring() {
        return NT4Types.FLOAT_64.dtstr;
    }

    @Override
    int getTypeInt() {
        return NT4Types.FLOAT_64.type_idx;
    }
    
}
