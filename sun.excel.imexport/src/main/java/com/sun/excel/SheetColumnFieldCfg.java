package com.sun.excel;

import java.lang.reflect.Field;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SheetColumnFieldCfg {
	private String columnCaption;
	private int columnIndex = Integer.MIN_VALUE;
	private String columnCode;
	private String dataSource;
	private String columnFormat;
	private boolean enableMulcol;
	private String fieldName;
	private Class<?> fieldType;
	private Field field;
}
