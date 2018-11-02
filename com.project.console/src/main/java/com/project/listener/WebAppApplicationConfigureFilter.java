package com.project.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/***
 * @author lilimin
 */
public class WebAppApplicationConfigureFilter implements ServletContextListener{
    public void contextInitialized(ServletContextEvent servletContextEvent) {

    }

    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        ServletContext servletContext = servletContextEvent.getServletContext();
        servletContext.setAttribute("webAppPath",servletContext.getContextPath());
    }
}
