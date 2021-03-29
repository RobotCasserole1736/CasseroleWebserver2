package frc.lib.Webserver2.DashboardConfig;

public class CircularGaugeConfig extends WidgetConfig {
    
    double minRange;
    double maxRange;
    double minAcceptable;
    double maxAcceptable;

    final double nominalWidth  = 20;
    final double nominalHeight = 20;

    @Override
    public String getHTML(){
        double width = nominalWidth * sizeScaleFactor;
        double height = nominalHeight * sizeScaleFactor;
        return genHtmlDeclaration(height, width);
    }
}
