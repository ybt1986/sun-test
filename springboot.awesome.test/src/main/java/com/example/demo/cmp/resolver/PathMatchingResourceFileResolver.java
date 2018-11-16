package com.example.demo.cmp.resolver;

import java.io.File;
import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

public class PathMatchingResourceFileResolver implements ResourceResolver {
	private ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
	
	@Override
	public File getFile(String resourceLocation) throws IOException {
		String path = resourceLocation;
		Resource[] resources = resourceResolver.getResources(path);
		if(resources == null || resources.length == 0|| !resources[0].exists()) {
			return null;
		}
		
		return resources[0].getFile();
	}

	@Override
	public boolean exist(String resourceLocation) {
		try {
			Resource[] resources = resourceResolver.getResources(resourceLocation);
			return resources != null && resources.length > 0 && resources[0].exists();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
}
