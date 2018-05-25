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
	private String columnIndex;
	private String columnCode;
	private String fieldName;
	private Class<?> fieldType;
	private Field field;
}
