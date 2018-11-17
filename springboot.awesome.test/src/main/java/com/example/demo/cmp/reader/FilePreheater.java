package com.example.demo.cmp.reader;

import java.io.File;
import java.io.FileNotFoundException;
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
import org.springframework.util.ResourceUtils;

import com.example.demo.cmp.ResourceFile;
import com.google.common.collect.Lists;

public class FilePreheater {
	private ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
	
	public void preheat()  {
		List<ResourceFile> fileList = this.list();
		System.out.println(fileList);
	}
	
	public List<ResourceFile> list() {
		List<ResourceFile> res = Lists.newArrayList();

		File file = new File(this.getRootPath());
		recursFile(Paths.get(file.toURI()), res);
		System.out.println(res.size());
		return res;
	}

	private String getRootPath() {
		try {
			Resource[] resources = resourceResolver.getResources("classpath*:static");
			for (Resource resource : resources) {
				if(!resource.exists()) {
					continue;
				}
				File root = resource.getFile();
				return root.getAbsolutePath();
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}

		return "";
	}

	private void recursFile(Path path, List<ResourceFile> res) {
		try {
			if (Files.isDirectory(path)) {
				try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(path)) {
					for (Path pathObj : directoryStream) {
						ResourceFile resFile = new ResourceFile();
						// 获取文件基本属性
						BasicFileAttributes attrs = Files.readAttributes(pathObj, BasicFileAttributes.class);
						resFile.setFileName(pathObj.getFileName().toString());
						resFile.setFileSize(attrs.size());
						res.add(resFile);

						this.recursFile(pathObj, res);
					}
				}
			} else {
				ResourceFile resFile = new ResourceFile();
				BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
				resFile.setFileName(path.getFileName().toString());
				resFile.setFileSize(attrs.size());
				res.add(resFile);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
