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
        return String.format("var widget%d = new Text('widget%d', '%s');", idx, idx, name);
    }

    @Override
    public String getJSUpdate() {
        return String.format("widget%d.render();", idx);
    }
    
}
