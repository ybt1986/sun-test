package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.UserRepository;

@RestController
public class IndexController {
	
	
	
	@GetMapping("/index")
	@ResponseBody
	public String test() {
		return "welcome";
	}
}
