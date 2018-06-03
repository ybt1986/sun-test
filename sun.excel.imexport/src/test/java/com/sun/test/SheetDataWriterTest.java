package com.sun.test;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Lists;
import com.sun.excel.ExcelType;
import com.sun.excel.common.CellTypeFormatRegistrar;
import com.sun.excel.common.CellTypeFormatRegistrar.CellFieldValueFormatAdapter;
import com.sun.excel.demo.Address;
import com.sun.excel.demo.Sex;
import com.sun.excel.demo.User;
import com.sun.excel.write.ExcelWriter;
import com.sun.excel.write.header.SheetHeaderWithCodeWriter;

public class SheetDataWriterTest {
	private List<User> users = Lists.newArrayList();

	@Before
	public void init() {
		CellTypeFormatRegistrar.registerCellFieldvalueFormat("sex", new CellFieldValueFormatAdapter<Sex>() {
			// @Override
			// public Sex read(String data) {
			// return Sex.parse(data);
			// }

			@Override
			public void write(Cell cell, Object value) {
				Sex sex = (Sex) value;
				cell.setCellType(CellType.STRING);
				cell.setCellValue(sex.getDesc());
			}
		});

		CellTypeFormatRegistrar.registerCellFieldvalueFormat("boolean", new CellFieldValueFormatAdapter<Boolean>() {
			@Override
			public void write(Cell cell, Object value) {
				boolean data = ((Boolean) value).booleanValue();
				cell.setCellType(CellType.STRING);
				if (data) {
					cell.setCellValue("1");
				} else {
					cell.setCellValue("0");
				}

			}
		});

		CellTypeFormatRegistrar.registerCellFieldvalueFormat("address", new CellFieldValueFormatAdapter<Address>() {
			@Override
			public void write(Cell cell, Object value) {
				Address address = (Address) value;
				cell.setCellType(CellType.STRING);
				if (address != null) {
					cell.setCellValue(address.getStreet() + " " + address.getNumber() + "号");
				}

			}
		});
	}

	@Before
	public void setup() {
		for (int i = 0; i < 10000; i++) {
			User user = new User();
			user.setId(i);
			user.setUserName("张三" + i);
			user.setSex(i % 3 == 0 ? Sex.MALE : Sex.FEMALE);
			user.setIdcard("10000" + i);
			user.setBirthday(new Date());
			user.setLocal(i % 4 == 0);

			Address address = new Address();
			address.setNumber("100");
			address.setStreet("上庄路");
			user.setAddress(address);
			users.add(user);
		}
	}

	@Test
	public void test01() {
		String fileName = "D:\\tmp\\用户列表_写入01.xlsx";
		try (ExcelWriter writer = new ExcelWriter(ExcelType.XLSX);) {
			writer.write(users, User.class, "用户列表01");
			writer.exportToFile(new File(fileName));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void test02() {
		String fileName = "D:\\tmp\\用户列表_写入02.xlsx";
		try (ExcelWriter writer = new ExcelWriter(ExcelType.XLSX);) {
			writer.write(users, User.class, "用户列表01", new SheetHeaderWithCodeWriter());
			writer.exportToFile(new File(fileName));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
