package com.sample.suncht.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IndexController {
	@RequestMapping("/demo/{id}")
	public ModelAndView demo1(ModelAndView mv, @PathVariable("id") String id) {
		mv.setViewName("demo" + id);
		return mv;
	}
}
