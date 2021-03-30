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

    @Override
    public String getJSDeclaration(){
        return String.format("var widget%d = new CircularGauge('widget%d', '%s', %f,%f,%f,%f);", idx, idx, name, minRange, maxRange, minAcceptable, maxAcceptable);
    }

    @Override
    public String getJSUpdate() {
        return String.format("widget%d.render();", idx);
    }
}
