package com.sun.test;

import java.io.File;
import java.io.IOException;

import org.junit.Test;

import com.sun.excel.read.ExcelReader;
import com.sun.excel.read.SheetData;
import com.sun.excel.read.body.DefaultSheetDataReader;
import com.sun.excel.read.header.DefaultSheetHeaderReader;

public class ExcelReaderTest {
	@Test
	public void read01() {
		File file = new File("C:\\Users\\sunchangtan\\Desktop\\用户列表.xlsx");
		try (ExcelReader exporter = new ExcelReader(file)) {
			SheetData sheetData = exporter.export("sheet2");
			System.out.println(sheetData);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void read02() {
		File file = new File("C:\\Users\\sunchangtan\\Desktop\\用户列表.xlsx");
		try (ExcelReader exporter = new ExcelReader(file)) {
			SheetData sheetData = exporter.export("sheet2", new DefaultSheetHeaderReader(), new DefaultSheetDataReader());
			System.out.println(sheetData);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
