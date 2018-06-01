package com.sun.test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.sun.excel.common.CellTypeFormatRegistrar;
import com.sun.excel.common.CellTypeFormatRegistrar.CellFieldValueFormatAdapter;
import com.sun.excel.demo.Sex;
import com.sun.excel.demo.User;
import com.sun.excel.demo.User2;
import com.sun.excel.read.BeanDataLoader;
import com.sun.excel.read.ExcelReader;
import com.sun.excel.read.SheetData;
import com.sun.excel.read.header.DefaultSheetHeaderReader;
import com.sun.excel.read.header.SheetHeaderWithCodeReader;

public class SheetDataLoaderTest {
	@Before
	public void init() {
		CellTypeFormatRegistrar.registerCellFieldvalueFormat("sex", new CellFieldValueFormatAdapter<Sex>() {
			@Override
			public Sex read(String data) {
				return Sex.parse(data);
			}

		});
	}

	@Test
	public void test01() {
		File file = new File("C:\\Users\\sunchangtan\\Desktop\\用户列表.xlsx");
		SheetData sheetData = null;
		try (ExcelReader exporter = new ExcelReader(file)) {
			sheetData = exporter.export("", new SheetHeaderWithCodeReader(), null);
			System.out.println(sheetData);
		} catch (IOException e) {
			e.printStackTrace();
		}
		List<User> users = BeanDataLoader.loadFromSheetData(sheetData, User.class);
		System.out.println(users);
	}

	@Test
	public void test02() {
		File file = new File("C:\\Users\\sunchangtan\\Desktop\\用户列表.xlsx");
		SheetData sheetData = null;
		try (ExcelReader exporter = new ExcelReader(file)) {
			sheetData = exporter.export("Sheet2", new DefaultSheetHeaderReader(), null);
			System.out.println(sheetData);
		} catch (IOException e) {
			e.printStackTrace();
		}

		List<User> users = BeanDataLoader.loadFromSheetData(sheetData, User.class);
		System.out.println(users);
	}

	@Test
	public void test03() {
		File file = new File("C:\\Users\\sunchangtan\\Desktop\\用户列表.xlsx");
		SheetData sheetData1 = null;
		SheetData sheetData2 = null;
		try (ExcelReader exporter = new ExcelReader(file)) {
			sheetData1 = exporter.export("用户", new DefaultSheetHeaderReader(), null);
			sheetData2 = exporter.export("Sheet4", new DefaultSheetHeaderReader(), null);
			// System.out.println(sheetData2);
		} catch (IOException e) {
			e.printStackTrace();
		}

		List<User> users1 = BeanDataLoader.loadFromSheetData(sheetData1, User.class);
		System.out.println(users1);

		List<User2> users2 = BeanDataLoader.loadFromSheetData(sheetData2, User2.class);
		System.out.println(users2);
	}
}
