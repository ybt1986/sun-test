package com.sun.excel.demo;

import com.sun.excel.SheetColumn;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Address {
	@SheetColumn(code = "street", caption = "地址道路")
	private String street;

	private String number;
}
