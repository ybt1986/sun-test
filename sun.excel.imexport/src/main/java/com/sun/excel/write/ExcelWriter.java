package com.sun.excel.write;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.google.common.base.Preconditions;
import com.sun.excel.ExcelType;
import com.sun.excel.write.header.DefaultSheetHeaderWriter;
import com.sun.excel.write.header.SheetHeaderWriter;

public class ExcelWriter implements Closeable {
	private Workbook workbook;

	public ExcelWriter(ExcelType excelType) {
		if (excelType == ExcelType.XLS) {
			workbook = new HSSFWorkbook();
		} else if (excelType == ExcelType.XLSX) {
			workbook = new XSSFWorkbook();
		}
	}

	public <T> void write(List<T> data, Class<T> clazz, String sheetName, SheetHeaderWriter headerWriter) {
		Preconditions.checkArgument(StringUtils.isNotBlank(sheetName), "sheetName isn't empty");

		if (headerWriter == null) {
			headerWriter = new DefaultSheetHeaderWriter();
		}

		Sheet sheet = workbook.createSheet(sheetName);
		headerWriter.write(sheet, clazz);
	}

	public void exportToFile(File file) throws IOException {
		try (OutputStream os = FileUtils.openOutputStream(file);) {
			workbook.write(os);
		}
	}

	@Override
	public void close() throws IOException {
		if (workbook != null) {
			workbook.close();
		}
	}
}
