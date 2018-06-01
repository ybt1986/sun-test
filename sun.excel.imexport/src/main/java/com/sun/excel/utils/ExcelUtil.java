package com.sun.excel.utils;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;

public class ExcelUtil {
	/**
	 * 类型
	 * 
	 * @param cell
	 * @return
	 */
	public static String getCellValue(Cell cell) {
		CellType cellType = cell.getCellTypeEnum();
		String cellValue = "";
		if (cell != null) {
			if (cellType == CellType.STRING) {
				cellValue = cell.getRichStringCellValue().getString().trim();
			} else if (cellType == CellType.NUMERIC) {
				if (HSSFDateUtil.isCellDateFormatted(cell)) { // 判断是否为日期类型
					Date date = cell.getDateCellValue();
					DateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					cellValue = formater.format(date);
				} else {
					DecimalFormat df = new DecimalFormat("#");
					cellValue = df.format(cell.getNumericCellValue()).toString();
				}
			} else if (cellType == CellType.BOOLEAN) {
				cellValue = String.valueOf(cell.getBooleanCellValue()).trim();
			} else if (cellType == CellType.FORMULA) {
				cellValue = cell.getCellFormula();
			} else {
				cellValue = cell.getStringCellValue();
			}
		}
		return cellValue;
	}

	/**
	 * 设置列头样式
	 *
	 * @param workbook
	 * @param sheet
	 * @param fieldNames
	 */
	public static CellStyle getHeaderStyle(Workbook workbook, Sheet sheet) {
		CellStyle cellStyle = workbook.createCellStyle();
		// 指定单元格居中对齐
		cellStyle.setAlignment(HorizontalAlignment.CENTER);
		// 指定单元格垂直居中对齐
		cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		// 指定单元格自动换行
		cellStyle.setWrapText(true);

		// 单元格字体
		Font font = workbook.createFont();
		font.setBold(true);
		font.setFontName("宋体");
		font.setFontHeight((short) 200);
		cellStyle.setFont(font);
		// 设置单元格的边框为粗体
		cellStyle.setBorderBottom(BorderStyle.THIN);
		// 设置单元格的边框颜色
		cellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
		cellStyle.setBorderLeft(BorderStyle.THIN);
		cellStyle.setLeftBorderColor(HSSFColor.BLACK.index);
		cellStyle.setBorderRight(BorderStyle.THIN);
		cellStyle.setRightBorderColor(HSSFColor.BLACK.index);
		cellStyle.setBorderTop(BorderStyle.THIN);
		cellStyle.setTopBorderColor(HSSFColor.BLACK.index);

		// 设置单元格背景色
		cellStyle.setFillForegroundColor(IndexedColors.TAN.getIndex());
		cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		return cellStyle;
	}
}
