package com.sun.excel.demo;

import com.sun.excel.Excelable;
import com.sun.excel.SheetColumn;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Address implements Excelable {
	@SheetColumn(code = "street", caption = "地址道路")
	private String street;

	@SheetColumn(code = "number", caption = "门牌号")
	private String number;
}
