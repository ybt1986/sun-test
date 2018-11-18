package com.example.demo.cmp.resolver;

import java.io.File;
import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

public class PathMatchingResourceFileResolver implements ResourceResolver {
	
	@Override
	public File getFile(String resourceLocation) throws IOException {
		String path = resourceLocation;
		Resource[] resources = new PathMatchingResourcePatternResolver().getResources(path);
		if(resources == null || resources.length == 0|| !resources[0].exists()) {
			return null;
		}
		
		return resources[0].getFile();
	}

	@Override
	public boolean exist(String resourceLocation) {
		try {
			Resource[] resources = new PathMatchingResourcePatternResolver().getResources(resourceLocation);
			return resources != null && resources.length > 0 && resources[0].exists();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}
}
