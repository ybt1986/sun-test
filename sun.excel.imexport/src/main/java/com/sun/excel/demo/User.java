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
public class User implements Excelable {
	@SheetColumn(code = "userId", caption = "用户ID")
	private int id;

	@SheetColumn(caption = "姓名")
	private String userName;

	@SheetColumn(caption = "性别")
	private Sex sex;

	@SheetColumn(code = "birthday", caption = "出生年月")
	private String birthday;

	@SheetColumn(code = "idcard", caption = "身份证号")
	private String idcard;

	@SheetColumn(code = "nation", caption = "祖籍")
	private String nation;

	@SheetColumn(code = "address", caption = "家庭住址")
	private Address address;
}
