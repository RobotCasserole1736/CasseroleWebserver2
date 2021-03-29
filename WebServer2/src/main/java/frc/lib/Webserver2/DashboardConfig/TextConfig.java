package frc.lib.Webserver2.DashboardConfig;

public class TextConfig extends WidgetConfig {
    
    final double nominalWidth  = 20;
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
