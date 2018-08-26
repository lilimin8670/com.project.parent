package com.project.controller;

import com.project.service.IndexService;
import com.project.service.impl.IndexServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;

@Controller
@RequestMapping
public class LoginController {

    @Resource
    private IndexService indexService;

    @RequestMapping("/login")
    public ModelAndView index(ModelAndView modelAndView){
        modelAndView.setViewName("system/login");
        return modelAndView;
    }
}
