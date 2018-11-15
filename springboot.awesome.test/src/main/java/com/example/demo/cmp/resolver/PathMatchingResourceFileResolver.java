package com.example.demo.cmp.resolver;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

import com.example.demo.utils.CompressorUtils;

public class PathMatchingResourceFileResolver implements ResourceResolver {
	private ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
	
	@Override
	public InputStream getFile(String resourceLocation) throws IOException {
		String path = resourceLocation;
		boolean isMin = true;
		Resource[] resources = resourceResolver.getResources(path);
		if(resources == null || resources.length == 0 || !resources[0].exists()) {
			//尝试使用非min文件
			if(path.contains(".min.")) {
				path = path.replace(".min.", ".");
			}
			resources = resourceResolver.getResources(path);
			isMin = false;
		}
		
		if(resources == null || resources.length == 0|| !resources[0].exists()) {
			return null;
		}
		
		File file = resources[0].getFile();
		if(!isMin) {
			//非压缩文件
		}
		
		CompressorUtils.compressJS(file, out);
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
