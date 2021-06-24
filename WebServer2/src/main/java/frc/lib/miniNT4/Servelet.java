package frc.lib.miniNT4;

import javax.servlet.annotation.WebServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

@SuppressWarnings("serial")
@WebServlet(name = "Mini NT4 Streamer Servlet", urlPatterns = {"/nt/*"})
class Servlet extends WebSocketServlet {

    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.getPolicy().setIdleTimeout(9000000); //Uber big
        factory.register(Socket.class);
    }
}