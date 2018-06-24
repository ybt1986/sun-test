package com.sample.suncht.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IndexController {
	@RequestMapping("/")
	public ModelAndView demo1(ModelAndView mv) {
		mv.setViewName("index");
		return mv;
	}
}
