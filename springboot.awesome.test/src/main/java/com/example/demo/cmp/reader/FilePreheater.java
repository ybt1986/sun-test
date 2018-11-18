package com.example.demo.cmp.reader;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.util.Assert;

import com.example.demo.cmp.ResourceConfig;
import com.example.demo.cmp.ResourceFile;
import com.google.common.collect.Lists;

/**
 * 文件预热
 * @author suncht
 *
 */
public class FilePreheater {
	private ResourceConfig resourceConfig;
	
	public FilePreheater(ResourceConfig resourceConfig) {
		this.resourceConfig = resourceConfig;
	}
	
	public void preheat()  {
		Assert.isTrue(resourceConfig.isEnableCache(), "need to enable cache");
		
		List<ResourceFile> fileList = this.list();
		
		for (ResourceFile resourceFile : fileList) {
			if(resourceFile.getFileType() != ResourceFile.TYPE_FILE) {
				continue;
			}
			if(resourceFile.getFileName().endsWith(".css") || resourceFile.getFileName().endsWith(".js")) {
				FileContentReader reader = new FileContentReader(this.resourceConfig, resourceFile.getFilePath());
				reader.read();
			}
		}
	}
	
	public List<ResourceFile> list() {
		List<ResourceFile> resourceFileList = Lists.newArrayListWithCapacity(64);

		File rootFile = this.getRootFile();
		if(rootFile == null) {
			return resourceFileList;
		}
		recursFile(Paths.get(rootFile.toURI()), resourceFileList, rootFile.getAbsolutePath());
		return resourceFileList;
	}

	private File getRootFile() {
		ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
		
		try {
			Resource[] resources = resourceResolver.getResources(resourceConfig.getStaticPath());
			for (Resource resource : resources) {
				if(!resource.exists()) {
					continue;
				}
				File root = resource.getFile();
				if(root == null) {
					continue;
				}
				
				return root;
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	private void recursFile(Path path, List<ResourceFile> res, String rootFilePath) {
		try {
			if (Files.isDirectory(path)) {
				try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(path)) {
					for (Path pathObj : directoryStream) {
						ResourceFile resFile = new ResourceFile();
						// 获取文件基本属性
						BasicFileAttributes attrs = Files.readAttributes(pathObj, BasicFileAttributes.class);
						resFile.setFileType(ResourceFile.TYPE_DIR);
						resFile.setFilePath(pathObj.toString().substring(rootFilePath.length()).replace("\\", "/"));
						resFile.setFileName(pathObj.getFileName().toString());
						resFile.setFileSize(attrs.size());
						res.add(resFile);

						this.recursFile(pathObj, res, rootFilePath);
					}
				}
			} else {
				ResourceFile resFile = new ResourceFile();
				BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
				resFile.setFileType(ResourceFile.TYPE_FILE);
				resFile.setFilePath(path.toString().substring(rootFilePath.length()).replace("\\", "/"));
				resFile.setFileName(path.getFileName().toString());
				resFile.setFileSize(attrs.size());
				res.add(resFile);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
}
