package frc.lib.miniNT4.topics;

public enum NT4Types {
    BOOL(0, "boolean"),   
    FLOAT_64(1, "double"),
    INT(2, "int"),
    FLOAT_32(3, "float"),
    STR(4, "string"),
    JSON(4, "json"),
    RAW(5, "raw"),
    RPC(5, "rpc"),
    MSGPACK(5, "msgpack"),
    PROTOBUF(5, "protobuf"),
    ARRAY_BOOL(16, "boolean[]"),
    ARRAY_FLOAT_64(17, "double[]"),
    ARRAY_INT(18, "int[]"),
    ARRAY_FLOAT_32(19, "float[]"),
    ARRAY_STR(20, "string[]");

    public final int type_idx;
    public final String dtstr;
    private NT4Types(int type_idx, String dtstr) {
        this.type_idx = type_idx;
        this.dtstr = dtstr;
    }
}
