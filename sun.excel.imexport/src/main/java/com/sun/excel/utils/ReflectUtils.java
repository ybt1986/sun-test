package com.sun.excel.utils;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.excel.SheetColumn;
import com.sun.excel.SheetColumnFieldCfg;
import com.sun.excel.SheetTable;
import com.sun.excel.SheetTableCfg;

public class ReflectUtils {
	private static final Map<Class<?>, SheetTableCfg> sheetTableCfg_cache = Maps.newConcurrentMap();
	private static final Map<Class<?>, List<SheetColumnFieldCfg>> sheetColumnFieldCfg_cache = Maps.newConcurrentMap();

	public static <T> SheetTableCfg getTableCfg(Class<T> clazz) {
		SheetTableCfg tableCfg = sheetTableCfg_cache.get(clazz);
		if (tableCfg == null) {
			SheetTable sheetTable = clazz.getAnnotation(SheetTable.class);
			if (sheetTable != null) {
				SheetTableCfg sheetTableCfg = new SheetTableCfg();
				sheetTableCfg.setCaption(sheetTable.caption());
				sheetTableCfg.setColumnIndexStrategy(sheetTable.indexStrategy());

				sheetTableCfg_cache.put(clazz, sheetTableCfg);

				return sheetTableCfg;
			}
		}
		return tableCfg;
	}

	public static <T> List<SheetColumnFieldCfg> getColumnFieldCfgs(Class<T> clazz) {
		List<SheetColumnFieldCfg> fieldList = sheetColumnFieldCfg_cache.get(clazz);
		if (fieldList == null) {
			List<SheetColumnFieldCfg> fields_cache = Lists.newArrayList();

			Field[] fields = clazz.getDeclaredFields();
			Arrays.asList(fields).stream().forEach(field -> {
				SheetColumn sheetColumn = field.getAnnotation(SheetColumn.class);
				if (sheetColumn != null) {
					SheetColumnFieldCfg columnField = new SheetColumnFieldCfg();
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

			sheetColumnFieldCfg_cache.put(clazz, fields_cache);

			return fields_cache;
		}

		return fieldList;
	}

	public static <T> Object getFieldValue(T data, String code, Class<T> clazz) {
		Preconditions.checkNotNull(data != null);

		List<SheetColumnFieldCfg> columnFieldCfgs = ReflectUtils.getColumnFieldCfgs(clazz);
		SheetColumnFieldCfg columnFieldCfg = ReflectUtils.getColumnFieldByCode(code, columnFieldCfgs);
		if (columnFieldCfg != null) {
			Field field = columnFieldCfg.getField();
			return ReflectUtils.getFieldValue(field, data);
		}

		return null;
	}

	public static SheetColumnFieldCfg getColumnFieldByCode(String code, List<SheetColumnFieldCfg> fields) {
		Optional<SheetColumnFieldCfg> columnField = fields.stream().filter(field -> field.getColumnCode().equals(code)).findFirst();

		if (!columnField.isPresent()) {
			columnField = fields.stream().filter(field -> field.getColumnCaption().equals(code)).findFirst();
		}
		// if (!columnField.isPresent()) {
		// throw new IllegalArgumentException("columnField correspond with [" +
		// code +
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
