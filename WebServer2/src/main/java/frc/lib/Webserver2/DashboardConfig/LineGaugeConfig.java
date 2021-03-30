package frc.lib.Webserver2.DashboardConfig;

public class LineGaugeConfig extends WidgetConfig {
    
    double minRange;
    double maxRange;
    double minAcceptable;
    double maxAcceptable;


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
        return String.format("var widget%d = new LineGauge('widget%d', '%s', %f,%f,%f,%f);", idx, idx, name, minRange, maxRange, minAcceptable, maxAcceptable);
    }

    @Override
    public String getJSUpdate() {
        return String.format("widget%d.render();", idx);
    }
    
}
