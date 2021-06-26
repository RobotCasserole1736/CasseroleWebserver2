package frc.lib.miniNT4.topics;

import frc.lib.miniNT4.samples.TimestampedDouble;

public class DoubleTopic extends Topic{

    public DoubleTopic(TimestampedDouble default_in) {
        super(default_in);
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
