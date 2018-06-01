package com.sun.excel.read;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.sun.excel.ExcelType;
import com.sun.excel.read.body.DefaultSheetBodyReader;
import com.sun.excel.read.body.SheetBodyReader;
import com.sun.excel.read.header.SheetColumnHeader;
import com.sun.excel.read.header.SheetHeaderReader;
import com.sun.excel.read.header.SheetHeaderWithCodeReader;

public class ExcelReader implements Closeable {
	private Workbook workbook;
	private ExcelType excelType;
	private InputStream fileInputStream;

	public ExcelReader(File file) throws IOException {
		String path = file.getAbsolutePath();

		fileInputStream = FileUtils.openInputStream(file);
		if (path.endsWith(".xls")) {
			excelType = ExcelType.XLS;
			workbook = new HSSFWorkbook(fileInputStream);
		} else if (path.endsWith(".xlsx")) {
			excelType = ExcelType.XLSX;
			workbook = new XSSFWorkbook(fileInputStream);
		}
	}

	public SheetData export() {
		return this.export("", null, null);
	}

	public SheetData export(String sheetName) {
		return this.export(sheetName, null, null);
	}

	public SheetData export(String sheetName, SheetHeaderReader headerParser) {
		return this.export(sheetName, headerParser, null);
	}

	public SheetData export(String sheetName, SheetHeaderReader headerReader, SheetBodyReader sheetDataReader) {
		Sheet sheet = null;
		if (!sheetName.trim().equals("")) {
			// 如果指定sheet名,则取指定sheet中的内容.
			sheet = workbook.getSheet(sheetName);
		}
		if (sheet == null) {
			// 如果传入的sheet名不存在则默认指向第1个sheet.
			sheet = workbook.getSheetAt(0);
		}

		if (headerReader == null) {
			headerReader = new SheetHeaderWithCodeReader();
		}

		if (sheetDataReader == null) {
			sheetDataReader = new DefaultSheetBodyReader();
		}

		Map<Integer, SheetColumnHeader> sheetHeader = headerReader.read(sheet);

		sheetDataReader.startRowIndex(headerReader.startRowIndex() + headerReader.rowNum());
		List<Map<Integer, String>> sheetData = sheetDataReader.read(sheet);

		return new SheetData(sheetHeader, sheetData);
	}

	@Override
	public void close() throws IOException {
		if (workbook != null) {
			workbook.close();
		}
		IOUtils.closeQuietly(fileInputStream);
	}
}
