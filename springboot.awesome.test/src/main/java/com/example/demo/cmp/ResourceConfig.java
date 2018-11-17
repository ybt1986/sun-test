package com.example.demo.cmp;

import com.example.demo.cache.CacheKit;
import com.example.demo.cache.ICache;
import com.example.demo.cmp.resolver.PathMatchingResourceFileResolver;
import com.example.demo.cmp.resolver.ResourceResolver;

public class ResourceConfig {
	private boolean enableCache = true;
	
	private boolean enableMin = true;
	
	private boolean enableVersion = true;
	
	private boolean enableCompress = true;
	
	private ICache cache = CacheKit.getLocalCache();
	
	private String staticPath = "classpath*:static";
	
	private ResourceResolver resourceResolver = new PathMatchingResourceFileResolver();
	
	private String contextPath;

	public ICache getCache() {
		return cache;
	}

	public void setCache(ICache cache) {
		this.cache = cache;
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

	public boolean isEnableCache() {
		return enableCache;
	}

	public void setEnableCache(boolean enableCache) {
		this.enableCache = enableCache;
	}

	public boolean isEnableMin() {
		return enableMin;
	}

	public void setEnableMin(boolean enableMin) {
		this.enableMin = enableMin;
	}

	public boolean isEnableVersion() {
		return enableVersion;
	}

	public void setEnableVersion(boolean enableVersion) {
		this.enableVersion = enableVersion;
	}

	public boolean isEnableCompress() {
		return enableCompress;
	}

	public void setEnableCompress(boolean enableCompress) {
		this.enableCompress = enableCompress;
	}

	public String getContextPath() {
		return contextPath;
	}

	public void setContextPath(String contextPath) {
		this.contextPath = contextPath;
	}
}
