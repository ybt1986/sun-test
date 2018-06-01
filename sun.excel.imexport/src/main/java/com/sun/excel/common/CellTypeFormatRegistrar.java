package com.sun.excel.common;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Workbook;

import com.google.common.collect.Maps;

public abstract class CellTypeFormatRegistrar {
	private static Map<String, CellFieldValueFormat<?>> cellFieldValueFormatRegistry = Maps.newConcurrentMap();

	static {
		cellFieldValueFormatRegistry.put("string", new StringCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("int", new IntegerCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("long", new LongCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("float", new FloatCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("double", new DoubleCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("date", new DateCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("datetime", new DateTimeCellFieldValueFormat());
		cellFieldValueFormatRegistry.put("boolean", new BooleanCellFieldValueFormat());
	}

	public static void registerCellFieldvalueFormat(String formatType, CellFieldValueFormat<?> format) {
		CellTypeFormatRegistrar.cellFieldValueFormatRegistry.put(formatType, format);
	}

	public static CellFieldValueFormat<?> getCellFieldValueFormat(String formatType) {
		CellFieldValueFormat<?> format = CellTypeFormatRegistrar.cellFieldValueFormatRegistry.get(formatType);
		return format != null ? format : new StringCellFieldValueFormat();
	}

	public static interface CellFieldValueFormat<T> {
		public T read(String value);

		public void write(Cell cell, Object value);
	}

	public static class CellFieldValueFormatAdapter<T> implements CellFieldValueFormat<T> {

		@Override
		public T read(String value) {
			return null;
		}

		@Override
		public void write(Cell cell, Object value) {

		}

	}

	public static class StringCellFieldValueFormat implements CellFieldValueFormat<String> {
		@Override
		public String read(String data) {
			return data;
		}

		@Override
		public void write(Cell cell, Object data) {
			cell.setCellType(CellType.STRING);
			if (data != null) {
				cell.setCellValue(data.toString());
			} else {
				cell.setCellValue("");
			}
		}

	}

	public static class IntegerCellFieldValueFormat implements CellFieldValueFormat<Integer> {

		@Override
		public Integer read(String data) {
			return Integer.valueOf(data);
		}

		@Override
		public void write(Cell cell, Object data) {
			cell.setCellType(CellType.NUMERIC);
			if (data != null) {
				cell.setCellValue(Integer.valueOf(data.toString()));
			} else {
				cell.setCellValue(0);
			}
		}

	}

	public static class LongCellFieldValueFormat implements CellFieldValueFormat<Long> {

		@Override
		public Long read(String data) {
			return Long.valueOf(data);
		}

		@Override
		public void write(Cell cell, Object data) {
			cell.setCellType(CellType.NUMERIC);
			if (data != null) {
				cell.setCellValue(Long.parseLong(data.toString()));
			} else {
				cell.setCellValue(0L);
			}
		}

	}

	public static class DoubleCellFieldValueFormat implements CellFieldValueFormat<Double> {

		@Override
		public Double read(String data) {
			return Double.valueOf(data);
		}

		@Override
		public void write(Cell cell, Object data) {
			cell.setCellType(CellType.NUMERIC);
			if (data != null) {
				cell.setCellValue(Double.parseDouble(data.toString()));
			} else {
				cell.setCellValue(0.0D);
			}
		}

	}

	public static class FloatCellFieldValueFormat implements CellFieldValueFormat<Float> {

		@Override
		public Float read(String data) {
			return Float.valueOf(data);
		}

		@Override
		public void write(Cell cell, Object data) {
			cell.setCellType(CellType.NUMERIC);
			if (data != null) {
				cell.setCellValue(Float.parseFloat(data.toString()));
			} else {
				cell.setCellValue(0.0F);
			}
		}

	}

	public static class DateCellFieldValueFormat implements CellFieldValueFormat<Date> {

		@Override
		public Date read(String data) {
			DateFormat formater = new SimpleDateFormat("yyyy-MM-dd");
			try {
				return formater.parse(data);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			return null;
		}

		@Override
		public void write(Cell cell, Object data) {
			Workbook workbook = cell.getRow().getSheet().getWorkbook();
			CellStyle dateCellStyle = workbook.createCellStyle();
			short df = workbook.createDataFormat().getFormat("yyyy-mm-dd");
			dateCellStyle.setDataFormat(df);

			cell.setCellType(CellType.NUMERIC);
			cell.setCellStyle(dateCellStyle);

			if (data != null) {
				Date dt = (Date) data;
				cell.setCellValue(dt);
			}
		}

	}

	public static class DateTimeCellFieldValueFormat implements CellFieldValueFormat<Date> {

		@Override
		public Date read(String data) {
			DateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				return formater.parse(data);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			return null;
		}

		@Override
		public void write(Cell cell, Object data) {
			Workbook workbook = cell.getRow().getSheet().getWorkbook();
			CellStyle dateCellStyle = workbook.createCellStyle();
			short df = workbook.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss");
			dateCellStyle.setDataFormat(df);

			cell.setCellType(CellType.NUMERIC);
			cell.setCellStyle(dateCellStyle);

			if (data != null) {
				Date dt = (Date) data;
				cell.setCellValue(dt);
			}
		}

	}

	public static class BooleanCellFieldValueFormat implements CellFieldValueFormat<Boolean> {

		private boolean check(String data) {
			return "1".equals(data) || "y".equalsIgnoreCase(data) || "yes".equalsIgnoreCase(data) || "true".equalsIgnoreCase(data) || "t".equalsIgnoreCase(data);
		}

		@Override
		public Boolean read(String data) {
			return check(data);
		}

		@Override
		public void write(Cell cell, Object data) {
			cell.setCellType(CellType.BOOLEAN);
			if (data != null) {
				cell.setCellValue(check(data.toString()));
			} else {
				cell.setCellValue(false);
			}
		}

	}
}
