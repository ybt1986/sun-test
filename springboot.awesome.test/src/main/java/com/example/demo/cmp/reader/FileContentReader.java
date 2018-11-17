package com.example.demo.cmp.reader;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.output.StringBuilderWriter;
import org.apache.commons.lang3.StringUtils;

import com.example.demo.cache.ICache;
import com.example.demo.cmp.ResourceConfig;
import com.example.demo.utils.CompressorUtils;
import com.google.common.base.Charsets;
import com.google.common.io.Files;

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
		if(StringUtils.isBlank(fileName)) {
			return "";
		}
		
		String extension = "." + Files.getFileExtension(fileName);
		if(StringUtils.isBlank(extension)) {
			return "";
		}
		
		if(!this.isJsFile(fileName) && !this.isCssFile(fileName)) {
			return "";
		}
		
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
	
	private boolean isJsFile(String fileName) {
		return fileName.endsWith(".js");
	}
	
	private boolean isCssFile(String fileName) {
		return fileName.endsWith(".css");
	}
	
	private String readContent() {
		try {
			File file = this.getFile();
			
			if(file == null) {
				return "";
			}
			
			if(resourceConfig.isEnableCompress() && !this.isMinFile(fileName)) {
				//如果为非min文件，则执行压缩
				final StringBuilderWriter sw = new StringBuilderWriter();
				if(this.isJsFile(fileName)) {
					CompressorUtils.compressJS(file, sw);
				} else if(this.isCssFile(fileName)) {
					CompressorUtils.compressCSS(file, sw);
				}
				return sw.toString();
			} else {
				return FileUtils.readFileToString(file, Charsets.UTF_8);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	
	private File getFile() throws IOException {
		String path = fileName;
		File file = null;
		if(resourceConfig.isEnableMin()) {
			//尝试使用min文件
			file = this.getMinFile(path);
			
			if(file == null) {
				//尝试使用非min文件
				file = this.getNoMinFile(path);
			}
		} else {
			file = resourceConfig.getResourceResolver().getFile(path);
			
			if(file == null) {
				if(this.isMinFile(path)) {
					//尝试使用非min文件
					file = this.getNoMinFile(path);
				} else {
					//尝试使用min文件
					file = this.getMinFile(path);
				}
			}
		}
		
		return file;
	}
	
	private File getMinFile(String path) throws IOException {
		//尝试使用min文件
		if(path.endsWith(".js") && !path.endsWith(".min.js")) {
			path = path.replace(".js", ".min.js");
		} else if(path.endsWith(".css") && !path.endsWith(".min.css")) {
			path = path.replace(".css", ".min.css");
		}
		return resourceConfig.getResourceResolver().getFile(path);
	}
	
	
	private File getNoMinFile(String path) throws IOException {
		//尝试使用非min文件
		if(path.endsWith(".min.js") || path.endsWith(".min.css")) {
			path = path.replace(".min.", ".");
		}
		return resourceConfig.getResourceResolver().getFile(path);
	}
}
