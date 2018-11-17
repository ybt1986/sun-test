package com.example.demo.cmp;

import java.io.Serializable;

public class ResourceFile implements Serializable {
	private static final long serialVersionUID = 929554235109320199L;

	private String fileName;
	private long fileSize;
	private int fileSuffix;

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
	
	@Override
	public String toString() {
		return fileName;
	}

}
