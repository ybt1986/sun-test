package com.example.demo.cmp.resolver;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

public class PathMatchingResourceFileResolver implements ResourceResolver {
	@Override
	public File getFile(String resourceLocation) throws IOException {
		String path = resourceLocation;
		String description = "class path resource [" + path + "]";
		
		ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
		Resource[] resources = resourceResolver.getResources(path);
		if(resources == null || resources.length == 0 || !resources[0].exists()) {
			//尝试使用非min文件
			if(path.contains(".min.")) {
				path = path.replace(".min.", ".");
			}
			
			resources = resourceResolver.getResources(path);
		}
		
		if(resources == null || resources.length == 0|| !resources[0].exists()) {
			throw new FileNotFoundException(description +
					" cannot be resolved to absolute file path because it does not exist");
		}
		
		return resources[0].getFile();
	}
}
