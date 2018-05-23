package com.sun.excel.demo;

import com.sun.excel.Excelable;
import com.sun.excel.SheetColumn;
import com.sun.excel.SheetTable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@SheetTable(name = "用户列表")
public class User implements Excelable {
	@SheetColumn(name = "id", caption = "用户ID")
	private int id;
	
	@SheetColumn(name = "userName", caption = "用户名")
	private String userName;
	
	@SheetColumn(name = "birthday", caption = "出生年月")
	private String birthday;
	
	@SheetColumn(name = "idcard", caption = "身份证号")
	private String idcard;
	
	@SheetColumn(name = "nation", caption = "祖籍")
	private String nation;
}
