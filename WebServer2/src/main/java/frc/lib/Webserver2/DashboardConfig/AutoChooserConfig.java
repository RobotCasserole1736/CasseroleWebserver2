package frc.lib.Webserver2.DashboardConfig;

import java.util.List;

public class AutoChooserConfig extends WidgetConfig {

    List<String> modeNameList;

    String nt4TopicDesVal = "";

    final double nominalWidth = 40;
    final double nominalHeight = 5;

    @Override
    public String getHTML() {
        double width = nominalWidth * sizeScaleFactor;
        double height = nominalHeight * sizeScaleFactor;
        return genHtmlDeclaration(height, width);
    }

    private String getJsModeNameListString() {
        String retVal = "";
        retVal += "[";
        for (int idx = 0; idx < modeNameList.size(); idx++) {
            retVal += "'" + modeNameList.get(idx) + "'";
            if (idx != (modeNameList.size() - 1)) {
                retVal += ",";
            }
        }
        retVal += "]";
        return retVal;
    }

    @Override
    public String getJSDeclaration() {
        String retStr = String.format("var widget%d = new AutoChooser('widget%d', '%s', %s, onWidget%dValUpdated);\n", idx, idx,
                name, getJsModeNameListString(), idx);
        retStr += String.format("nt4Client.subscribe(\"%s\");", nt4TopicCurVal);
        return retStr;
    }

    @Override
    public String getJSSetData(){
        String retStr = "";
        retStr += "if(name == \"" + nt4TopicCurVal + "\"){ ";
        retStr += String.format("    widget%d.setActualState(value);", idx);
        retStr += "}";
        return retStr;
    }

    @Override
    public String getJSUpdate() {
        return String.format("    widget%d.render();", idx);
    }

    public String getJSCallback() {
        String retStr = String.format("function onWidget%dValUpdated(value) {\n", idx);
        retStr +=  String.format("    nt4Client.sendDataValue(\"%s\", nt4Client.getCurTimestamp(), value);\n", nt4TopicDesVal);
        retStr += "}";
        return retStr;

    }

}
