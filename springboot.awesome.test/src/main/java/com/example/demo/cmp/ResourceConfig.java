package com.example.demo.cmp;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.example.demo.cache.CacheKit;
import com.example.demo.cache.ICache;
import com.example.demo.cmp.resolver.PathMatchingResourceFileResolver;
import com.example.demo.cmp.resolver.ResourceResolver;
import com.google.common.collect.Lists;

public class ResourceConfig {
	private ICache cache = CacheKit.getLocalCache();
	
	private List<String> fileExtensions = Lists.newArrayList("js", "css");
	
	private String staticPath = "classpath*:static";
	
	private ResourceResolver resourceResolver = new PathMatchingResourceFileResolver();

	public ICache getCache() {
		return cache;
	}

	public void setCache(ICache cache) {
		this.cache = cache;
	}

	public List<String> getFileExtensions() {
		return fileExtensions;
	}

	public void setFileExtensions(List<String> fileExtensions) {
		this.fileExtensions = Lists.newArrayList(fileExtensions);
	}
	
	public void addFileExtension(String fileExtension) {
		if(StringUtils.isBlank(fileExtension)) {
			return;
		}
		
		if(this.fileExtensions == null) {
			this.fileExtensions = Lists.newArrayList();
		}
		
		String extension = fileExtension.toLowerCase();
		if(extension.startsWith(".")) {
			extension = extension.substring(1);
		}
		this.fileExtensions.add(extension);
	}

	public String getStaticPath() {
		return staticPath;
	}

	public void setStaticPath(String staticPath) {
		this.staticPath = staticPath;
	}

	public ResourceResolver getResourceResolver() {
		return resourceResolver;
	}

	public void setResourceResolver(ResourceResolver resourceResolver) {
		this.resourceResolver = resourceResolver;
	}
}
