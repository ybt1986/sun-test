package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class OrderController {
	@RequestMapping("/order1.do")
	public String order1(Model model) {
		return "/order";
	}

	@RequestMapping("/order2.do")
	public String order2(Model model) {
		return "/order2";
	}

	@RequestMapping("/simple.do")
	public String simple(Model model) {
		return "/simple";
	}
}
