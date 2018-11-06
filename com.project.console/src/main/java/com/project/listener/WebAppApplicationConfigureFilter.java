package com.project.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/***
 * @author lilimin
 */
public class WebAppApplicationConfigureFilter implements ServletContextListener{
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        ServletContext servletContext = servletContextEvent.getServletContext();
        String servletContextName = servletContext.getServletContextName();
        servletContext.setAttribute("webAppPath", servletContextName);

    }

    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }
}
