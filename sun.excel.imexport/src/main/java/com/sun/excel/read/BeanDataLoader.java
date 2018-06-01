package com.sun.excel.read;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.excel.ColumnField;
import com.sun.excel.SheetColumn;
import com.sun.excel.common.CellTypeFormatRegistrar;
import com.sun.excel.common.CellTypeFormatRegistrar.CellFieldValueFormat;
import com.sun.excel.read.header.SheetColumnHeader;
import com.sun.excel.utils.ClassFieldUtil;

/**
 * 对象Bean集合数据加载器
 * 
 * @author sunchangtan
 *
 */
public class BeanDataLoader {

	/**
	 * 从SheetData中加载数据
	 * 
	 * @param sheetData
	 * @param clazz
	 * @return 返回对象列表
	 */
	public static <T> List<T> loadFromSheetData(SheetData sheetData, Class<T> clazz) {
		List<ColumnField> columnFields = ClassFieldUtil.getColumnFields(clazz, SheetColumn.class);

		List<Map<String, String>> datas = transform(sheetData.getSheetHeader(), sheetData.getSheetData());

		List<T> objects = Lists.newArrayList();

		T entity = null;
		for (Map<String, String> rowData : datas) {
			entity = org.springframework.beans.BeanUtils.instantiate(clazz);
			for (Entry<String, String> cellData : rowData.entrySet()) {
				String code = cellData.getKey();
				String value = cellData.getValue();

				ColumnField columnField = ClassFieldUtil.getColumnFieldByCode(code, columnFields);
				if (columnField != null) {
					try {
						setFieldValue(columnField, entity, value);
					} catch (Exception e) {
						System.out.println(e);
					}
				}
			}
			objects.add(entity);
		}

		return objects;
	}

	private static List<Map<String, String>> transform(final Map<Integer, SheetColumnHeader> sheetHeader, final List<Map<Integer, String>> sheetData) {
		List<Map<String, String>> dataTransformed = Lists.newArrayList();

		sheetData.forEach(map -> {
			final Map<String, String> data = Maps.newHashMap();
			map.forEach((index, value) -> {
				SheetColumnHeader header = sheetHeader.get(index);
				if (header != null) {
					data.put(header.getCode(), value);
				}
			});
			dataTransformed.add(data);
		});

		return dataTransformed;
	}

	private static void setFieldValue(ColumnField columnField, Object entity, String value) throws Exception {
		Field field = columnField.getField();
		Class<?> fieldType = field.getType();
		field.setAccessible(true);
		CellFieldValueFormat<?> formatter = CellTypeFormatRegistrar.getCellFieldValueFormat(columnField.getColumnFormat());
		if (formatter == null) {
			throw new IllegalArgumentException("formatter of type[" + fieldType.getName() + "]  can't found");
		}

		Object data = formatter.read(value);
		field.set(entity, data);
	}
}
