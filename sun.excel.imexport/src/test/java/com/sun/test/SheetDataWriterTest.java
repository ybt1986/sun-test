package com.sun.test;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Lists;
import com.sun.excel.ExcelType;
import com.sun.excel.demo.Sex;
import com.sun.excel.demo.User;
import com.sun.excel.write.ExcelWriter;
import com.sun.excel.write.header.DefaultSheetHeaderWriter;

public class SheetDataWriterTest {
	private List<User> users = Lists.newArrayList();

	@Before
	public void setup() {
		for (int i = 0; i < 1000; i++) {
			User user = new User();
			user.setId(i);
			user.setUserName("张三" + i);
			user.setSex(i % 3 == 0 ? Sex.MALE : Sex.FEMALE);
			user.setIdcard("10000" + i);
			user.setBirthday(new Date().toString());

			users.add(user);
		}
	}

	@Test
	public void test01() {
		String fileName = "C:\\Users\\sunchangtan\\Desktop\\用户列表01.xlsx";
		try (ExcelWriter writer = new ExcelWriter(ExcelType.XLSX);) {
			writer.write(users, User.class, "用户列表01", new DefaultSheetHeaderWriter());
			writer.exportToFile(new File(fileName));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
