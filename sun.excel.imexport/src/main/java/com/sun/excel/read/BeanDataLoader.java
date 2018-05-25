package com.sun.excel.read;

import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.excel.ColumnField;
import com.sun.excel.SheetColumn;
import com.sun.excel.read.header.SheetColumnHeader;
import com.sun.excel.utils.ClassFieldUtil;

/**
 * 对象Bean集合数据加载器
 * 
 * @author sunchangtan
 *
 */
public class BeanDataLoader {

	private static Map<Class<?>, FieldDataFormatter<?>> fieldDataFormatterRegistry = Maps.newConcurrentMap();

	static {
		fieldDataFormatterRegistry.put(String.class, new FieldStringDataFormatter());
		fieldDataFormatterRegistry.put(Integer.class, new FieldIntDataFormatter());
		fieldDataFormatterRegistry.put(int.class, new FieldIntDataFormatter());
		fieldDataFormatterRegistry.put(Long.class, new FieldLongDataFormatter());
		fieldDataFormatterRegistry.put(long.class, new FieldIntDataFormatter());
		fieldDataFormatterRegistry.put(Float.class, new FieldFloatDataFormatter());
		fieldDataFormatterRegistry.put(float.class, new FieldFloatDataFormatter());
		fieldDataFormatterRegistry.put(Double.class, new FieldDoubleDataFormatter());
		fieldDataFormatterRegistry.put(double.class, new FieldDoubleDataFormatter());
		fieldDataFormatterRegistry.put(Date.class, new FieldDateDataFormatter());
	}

	public static void registerFieldDataFormatter(Class<?> clazz, FieldDataFormatter<?> formatter) {
		BeanDataLoader.fieldDataFormatterRegistry.put(clazz, formatter);
	}

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

				ColumnField columnField = getFieldByCode(code, columnFields);
				if (columnField != null) {
					try {
						setFieldValue(columnField.getField(), entity, value);
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

	private static ColumnField getFieldByCode(String code, List<ColumnField> fields) {
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

	private static void setFieldValue(Field field, Object entity, String value) throws Exception {
		Class<?> fieldType = field.getType();
		field.setAccessible(true);
		FieldDataFormatter<?> formatter = BeanDataLoader.fieldDataFormatterRegistry.get(fieldType);
		if (formatter == null) {
			throw new IllegalArgumentException("formatter of type[" + fieldType.getName() + "]  can't found");
		}

		Object data = formatter.format(value);
		field.set(entity, data);
	}

	public static interface FieldDataFormatter<T> {
		T format(String value);
	}

	public static class FieldStringDataFormatter implements FieldDataFormatter<String> {
		@Override
		public String format(String value) {
			return value;
		}
	}

	public static class FieldIntDataFormatter implements FieldDataFormatter<Integer> {
		@Override
		public Integer format(String value) {
			return Integer.valueOf(value);
		}
	}

	public static class FieldLongDataFormatter implements FieldDataFormatter<Long> {
		@Override
		public Long format(String value) {
			return Long.valueOf(value);
		}
	}

	public static class FieldDoubleDataFormatter implements FieldDataFormatter<Double> {
		@Override
		public Double format(String value) {
			return Double.valueOf(value);
		}
	}

	public static class FieldFloatDataFormatter implements FieldDataFormatter<Float> {
		@Override
		public Float format(String value) {
			return Float.valueOf(value);
		}
	}

	public static class FieldShortDataFormatter implements FieldDataFormatter<Short> {
		@Override
		public Short format(String value) {
			return Short.valueOf(value);
		}
	}

	public static class FieldDateDataFormatter implements FieldDataFormatter<Date> {
		@Override
		public Date format(String value) {
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				Date dt = df.parse(value);
				return dt;
			} catch (ParseException e) {
				e.printStackTrace();
			}
			return null;
		}
	}

}
