package com.sun.excel.demo;

import com.sun.excel.Excelable;
import com.sun.excel.SheetColumn;
import com.sun.excel.SheetTable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@SheetTable(name = "用户列表")
public class User2 implements Excelable {
	@SheetColumn(caption = "用户id")
	private int id;

	@SheetColumn(caption = "姓名")
	private String userName;

	@SheetColumn(caption = "性别")
	private Sex sex;

	@SheetColumn(caption = "出生年月")
	private String birthday;

	@SheetColumn(caption = "身份证号")
	private String idcard;

	@SheetColumn(caption = "国籍")
	private String nation;
}
