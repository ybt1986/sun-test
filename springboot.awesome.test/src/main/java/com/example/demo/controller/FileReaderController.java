package com.example.demo.controller;

import java.io.File;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.cache.ICache;
import com.example.demo.cmp.ResourceConfig;
import com.google.common.base.Charsets;
import com.google.common.io.Files;

@Controller
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
		
		String extension = Files.getFileExtension(requestUrl);
		if(StringUtils.isBlank(extension)) {
			return "";
		}
		
		if(!resourceConfig.getFileExtensions().contains(extension)) {
			return "";
		}
		
		ICache cache = resourceConfig.getCache();
		String content = cache.get("resource", requestUrl);
		if (StringUtils.isBlank(content)) {
			content = readContent(requestUrl);
			cache.put("resource", requestUrl, content);
		}

		return content;
	}

	private String readContent(String filename) {
		try {
			
			File file = resourceConfig.getResourceResolver().getFile(resourceConfig.getStaticPath() + (filename.startsWith("/") ? "" :  "/") + filename);
			return FileUtils.readFileToString(file, Charsets.UTF_8);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	
	
}
