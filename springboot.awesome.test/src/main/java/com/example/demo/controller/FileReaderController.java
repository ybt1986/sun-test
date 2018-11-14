package com.example.demo.controller;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.cache.CacheKit;
import com.example.demo.cache.ICache;
import com.google.common.base.Charsets;

@Controller
public class FileReaderController {
	@RequestMapping("/resource/**")
	@ResponseBody
	public String getResource(HttpServletRequest request) {
		String requestUrl = request.getRequestURI();
		requestUrl = requestUrl.substring("/resource".length());

		ICache cache = CacheKit.getLocalCache();
		String content = cache.get("resource", requestUrl);
		if (StringUtils.isBlank(content)) {
			content = readContent(requestUrl);
			cache.put("resource", requestUrl, content);
		}

		return content;
	}

	private String readContent(String filename) {
		try {
			File file = ResourceUtils.getFile("classpath:static/" + filename);
			String content = FileUtils.readFileToString(file, Charsets.UTF_8);
			return content;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
}
