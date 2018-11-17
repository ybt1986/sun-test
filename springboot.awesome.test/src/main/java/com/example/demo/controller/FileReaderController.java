package com.example.demo.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.cmp.ResourceConfig;
import com.example.demo.cmp.reader.FileContentReader;

//@Controller
public class FileReaderController {
	@Resource
	private ResourceConfig resourceConfig;
	
	@RequestMapping("/resource/**")
	@ResponseBody
	public String getResource(HttpServletRequest request) {
		Assert.notNull(resourceConfig, "Resource Config must not be null");
		
		String requestUrl = request.getRequestURI();
		requestUrl = requestUrl.substring(9); //"/resource".length()==9
		
		if(StringUtils.isBlank(requestUrl)) {
			return "";
		}
		return new FileContentReader(resourceConfig, requestUrl).read();
	}

	
}
