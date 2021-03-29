package frc.lib.Webserver2.DashboardConfig;

public class IconConfig extends WidgetConfig {
    
    String colorOn = "";
    String colorOff = "";
    String symbolPath = "";


    final double nominalWidth  = 5;
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
