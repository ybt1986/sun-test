package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {
	@GetMapping("/index")
	@ResponseBody
	public String test() {
		return "welcome";
	}
}
