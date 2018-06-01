package com.sun.excel;

import java.lang.reflect.Field;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ColumnField {
	private String columnCaption;
	private int columnIndex;
	private String columnCode;
	private String columnFormat;
	private boolean enableMulcol;
	private String fieldName;
	private Class<?> fieldType;
	private Field field;
}
