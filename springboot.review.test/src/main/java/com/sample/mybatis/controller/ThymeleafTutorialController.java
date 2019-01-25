package com.sample.mybatis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 用于Thymeleaf学习
 * 
 * @author sunchangtan
 *
 */
@Controller
public class ThymeleafTutorialController {
	@RequestMapping("test01")
	public ModelAndView test01(ModelAndView mv) {
		mv.setViewName("/tutorial/test01");
		return mv;
	}
}
