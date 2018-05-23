package com.sun.excel.export;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.sun.excel.ExcelType;
import com.sun.excel.Excelable;
import com.sun.excel.utils.Iterables;

public class ExcelExport {
	private Workbook workbook;
	private ExcelType excelType;
	
	public ExcelExport(File file) {
		String path = file.getAbsolutePath();
		if(path.endsWith(".xls")) {
			excelType = ExcelType.XLS;
			workbook = new HSSFWorkbook();
		} else if(path.endsWith(".xlsx")) {
			excelType = ExcelType.XLSX;
			workbook = new XSSFWorkbook();
		}
	}
	
	public void loadData(Map<String, List<Excelable>> datas) {
		datas.forEach((sheetName, list) -> {
			Sheet sheet = workbook.createSheet(sheetName);
			
			Iterables.forEach(list, (index, data) -> {
				Row row = sheet.createRow(index);
				
			});
		});
		
	}
}
