package com.sun.excel.demo;

import java.util.Date;

import com.sun.excel.Excelable;
import com.sun.excel.SheetColumn;
import com.sun.excel.SheetTable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@SheetTable(caption = "用户列表")
public class User2 implements Excelable {
	@SheetColumn(code = "userId", caption = "用户ID", format = "int", index = 1)
	private int id;

	@SheetColumn(caption = "姓名", index = 0)
	private String userName;

	@SheetColumn(caption = "性别", format = "sex", index = 2)
	private Sex sex;

	@SheetColumn(code = "birthday", caption = "出生年月", format = "date")
	private Date birthday;

	@SheetColumn(code = "idcard", caption = "身份证号")
	private String idcard;

	@SheetColumn(code = "nation", caption = "祖籍")
	private String nation;

	@SheetColumn(code = "isLocal", caption = "是否本地人", format = "boolean")
	private boolean isLocal;

	@SheetColumn(code = "address", caption = "家庭住址", format = "address", mulcol = true)
	private Address address;
}
