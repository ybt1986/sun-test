package com.sun.excel.utils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.excel.ColumnField;
import com.sun.excel.SheetColumn;

public class ClassFieldUtil {
	private static final Map<Class<?>, List<ColumnField>> class_fields_map = Maps.newConcurrentMap();

	private static final Map<Class<?>, List<Field>> class_fields_cache = Maps.newConcurrentMap();

	public static <T> List<Field> getFields(Class<T> clazz, Class<? extends Annotation> annotianClass) {
		List<Field> fieldList = class_fields_cache.get(clazz);
		if (fieldList == null) {
			List<Field> fields_cache = Lists.newArrayList();

			Field[] fields = clazz.getDeclaredFields();
			Arrays.asList(fields).stream().filter(field -> field.getAnnotation(annotianClass) != null).forEach(field -> {
				fields_cache.add(field);
			});

			class_fields_cache.put(clazz, fields_cache);

			return fields_cache;
		}

		return fieldList;
	}

	public static <T> List<ColumnField> getColumnFields(Class<T> clazz, Class<? extends Annotation> annotianClass) {
		List<ColumnField> fieldList = class_fields_map.get(clazz);
		if (fieldList == null) {
			List<ColumnField> fields_cache = Lists.newArrayList();

			Field[] fields = clazz.getDeclaredFields();
			Arrays.asList(fields).stream().forEach(field -> {
				SheetColumn sheetColumn = field.getAnnotation(SheetColumn.class);
				if (sheetColumn != null) {
					ColumnField columnField = new ColumnField();
					columnField.setColumnCaption(sheetColumn.caption());
					if (StringUtils.isNotBlank(sheetColumn.code())) {
						columnField.setColumnCode(sheetColumn.code());
					} else { // 如果ColumnCode为空，则取字段名
						columnField.setColumnCode(field.getName());
					}

					columnField.setColumnIndex(sheetColumn.index());
					columnField.setFieldType(field.getType());
					columnField.setFieldName(field.getName());
					columnField.setField(field);

					fields_cache.add(columnField);
				}
			});

			class_fields_map.put(clazz, fields_cache);

			return fields_cache;
		}

		return fieldList;
	}

}
