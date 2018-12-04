package com.example.demo.cmp;

import java.io.Serializable;

public class ResourceFile implements Serializable {
	private static final long serialVersionUID = 929554235109320199L;
	
	public static final int TYPE_FILE = 1;
	public static final int TYPE_DIR = 2;

	private String filePath;
	private String fileName;
	private long fileSize;
	private int fileSuffix;
	/**
	 * 文件类型： 1-文件， 2-目录
	 */
	private int fileType = TYPE_FILE;

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public long getFileSize() {
		return fileSize;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}

	public int getFileSuffix() {
		return fileSuffix;
	}

	public void setFileSuffix(int fileSuffix) {
		this.fileSuffix = fileSuffix;
	}
	
	
	public int getFileType() {
		return fileType;
	}

	public void setFileType(int fileType) {
		this.fileType = fileType;
	}

	@Override
	public String toString() {
		return fileName;
	}

}
