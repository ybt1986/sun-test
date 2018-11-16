package com.example.demo.cmp.reader;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import com.example.demo.cache.ICache;
import com.example.demo.cmp.ResourceConfig;
import com.google.common.base.Charsets;

public class FileContentReader {
	private ResourceConfig resourceConfig;
	private String fileName;
	
	public FileContentReader(ResourceConfig resourceConfig, String fileName) {
		this.resourceConfig = resourceConfig;

		if(fileName.startsWith(resourceConfig.getStaticPath())) {
			this.fileName = fileName;
		} else {
			this.fileName = resourceConfig.getStaticPath() + (fileName.startsWith("/") ? "" :  "/") + fileName;
		}
	}
	
	public String read() {
		if(resourceConfig.isEnableCache()) {
			String key = "cache::" + this.fileName;
			ICache cache = resourceConfig.getCache();
			String content = cache.get("resource", key);
			if (StringUtils.isBlank(content)) {
				content = readContent();
				cache.put("resource", key, content);
			}
			
			return content;
		} else {
			return readContent();
		}
	}
	
	private boolean isMinFile(String fileName) {
		return fileName.contains(".min.");
	}
	
	private String readContent() {
		try {
			File file = this.getFile();
			
			if(file == null) {
				return "";
			}
			
			return FileUtils.readFileToString(file, Charsets.UTF_8);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	
	private File getFile() throws IOException {
		String path = fileName;
		File file = resourceConfig.getResourceResolver().getFile(path);
		if(file == null) {
			if(this.isMinFile(path)) {
				//尝试使用非min文件
				path = path.replace(".min.", ".");
				file = resourceConfig.getResourceResolver().getFile(path);
			} else {
				//尝试使用min文件
				if(path.endsWith(".js")) {
					path = path.replace(".js", ".min.js");
				} else if(path.endsWith(".css")) {
					path = path.replace(".css", ".min.css");
				}
				file = resourceConfig.getResourceResolver().getFile(path);
			}
		}
		
		return file;
	}
	
}
