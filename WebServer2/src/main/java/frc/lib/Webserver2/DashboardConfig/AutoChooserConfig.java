package frc.lib.Webserver2.DashboardConfig;

import java.util.List;

public class AutoChooserConfig extends WidgetConfig {
   
    List<String> modeNameList;

    final double nominalWidth = 40;
    final double nominalHeight = 5;

    @Override
    public String getHTML(){
        double width = nominalWidth * sizeScaleFactor;
        double height = nominalHeight * sizeScaleFactor;
        return genHtmlDeclaration(height, width);
    }

    private String getJsModeNameListString(){
        String retVal = "";
        retVal += "[";
        for(int idx = 0; idx < modeNameList.size(); idx++ ){
            retVal += "'" + modeNameList.get(idx) + "'";
            if(idx != (modeNameList.size() - 1)){
                retVal += ",";
            }
        }
        retVal += "]";
        return retVal;
    }

    @Override
    public String getJSDeclaration(){
        return String.format("var widget%d = new AutoChooser('widget%d', '%s', %s, onWidget%dValUpdated);", idx, idx, name, getJsModeNameListString(), idx);
    }

    @Override
    public String getJSUpdate() {
        return String.format("widget%d.render();", idx);
    }

    public String getJSCallback() {
        return String.format("function onWidget%dValUpdated() {}", idx); //TODO - actual content
    }
    
     
}
