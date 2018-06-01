package com.sun.excel.utils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

import com.google.common.base.Preconditions;
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
					columnField.setColumnFormat(sheetColumn.format());
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

	public static <T> Object getFieldValue(T data, String code, Class<T> clazz) {
		Preconditions.checkNotNull(data != null);

		List<ColumnField> columnFields = ClassFieldUtil.getColumnFields(clazz, SheetColumn.class);
		ColumnField columnField = ClassFieldUtil.getColumnFieldByCode(code, columnFields);
		if (columnField != null) {
			Field field = columnField.getField();
			return ClassFieldUtil.getFieldValue(field, data);
		}

		return null;
	}

	public static ColumnField getColumnFieldByCode(String code, List<ColumnField> fields) {
		Optional<ColumnField> columnField = fields.stream().filter(field -> field.getColumnCode().equals(code)).findFirst();

		if (!columnField.isPresent()) {
			columnField = fields.stream().filter(field -> field.getColumnCaption().equals(code)).findFirst();
		}
		// if (!columnField.isPresent()) {
		// throw new IllegalArgumentException("columnField correspond with [" + code +
		// "] can't found");
		// }

		return columnField.orElse(null);
	}

	public static Object getFieldValue(Field field, Object object) {
		try {
			field.setAccessible(true);
			return field.get(object);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}

		return null;
	}

}
