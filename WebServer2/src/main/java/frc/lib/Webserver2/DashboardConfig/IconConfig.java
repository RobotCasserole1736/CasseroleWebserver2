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
        String retStr = String.format("var widget%d = new Icon('widget%d', '%s', '%s', '%s', '%s');\n", idx, idx, name, colorOn, colorOff, symbolPath);
        retStr += String.format("nt4Client.subscribe(\"%s\");", nt4TopicCurVal);
        return retStr;
    }

    @Override
    public String getJSSetData(){
        String retStr = "";
        retStr += "if(name == \"" + nt4TopicCurVal + "\"){ \n";
        retStr += "    if(value == 1){ \n";
        retStr += String.format("        widget%d.setVal(Icon.kON);\n", idx);
        retStr += "    } else if(value == 2) {\n";
        retStr += String.format("        widget%d.setVal(Icon.kBLINK);\n", idx);
        retStr += "    } else {\n";
        retStr += String.format("        widget%d.setVal(Icon.kOFF);\n", idx);
        retStr += "    }";
        retStr += "}";


        return retStr;
    }

    @Override
    public String getJSUpdate() {
        return String.format("    widget%d.render();", idx);
    }
    
}
