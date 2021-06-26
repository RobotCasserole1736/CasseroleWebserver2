package frc.lib.miniNT4.topics;

import frc.lib.miniNT4.samples.TimestampedString;

public class StringTopic extends Topic{

    public StringTopic(TimestampedString default_in) {
        super(default_in);
    }

    @Override
    String getTypestring() {
        return NT4Types.STR.dtstr;
    }

    @Override
    int getTypeInt() {
        return NT4Types.STR.type_idx;
    }
    
    
}
