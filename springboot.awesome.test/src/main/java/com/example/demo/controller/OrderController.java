package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/order/v1")
public class OrderController {
	@RequestMapping({"", "/", "index"})  
    public String index(Model model){  
        return "/order";  
    }  
}
