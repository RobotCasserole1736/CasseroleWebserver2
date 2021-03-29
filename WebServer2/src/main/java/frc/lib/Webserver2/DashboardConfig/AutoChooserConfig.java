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

    @Override
    public String getJSDeclaration(){
        return "";
    }
     
}
