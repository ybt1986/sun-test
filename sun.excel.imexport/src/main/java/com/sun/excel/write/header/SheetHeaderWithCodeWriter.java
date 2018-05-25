package com.sun.excel.write.header;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.sun.excel.ColumnField;
import com.sun.excel.SheetColumn;
import com.sun.excel.utils.ClassFieldUtil;
import com.sun.excel.utils.ExcelUtil;
import com.sun.excel.utils.Iterables;

public class SheetHeaderWithCodeWriter implements SheetHeaderWriter {

	@Override
	public <T> void write(Sheet sheet, Class<T> clazz) {
		CellStyle style = sheet.getWorkbook().createCellStyle();
		style.setAlignment(HorizontalAlignment.CENTER);

		sheet.setDefaultColumnWidth(20);

		CellStyle cellStyle = ExcelUtil.getHeaderStyle(sheet.getWorkbook(), sheet);

		Row row1 = sheet.createRow(startRow());
		Row row2 = sheet.createRow(startRow() + 1);

		List<ColumnField> columnFields = ClassFieldUtil.getColumnFields(clazz, SheetColumn.class);
		Iterables.forEach(columnFields, (index, columnField) -> {
			String caption = columnField.getColumnCaption();
			String code = columnField.getColumnCode();

			Cell cell1 = row1.createCell(index);
			Cell cell2 = row2.createCell(index);
			cell1.setCellStyle(cellStyle);
			cell2.setCellStyle(cellStyle);
			if (StringUtils.isNotBlank(caption) && StringUtils.isNotBlank(code)) {
				cell1.setCellValue(caption);
				cell2.setCellValue(code);
			} else if (StringUtils.isBlank(caption) && StringUtils.isNotBlank(code)) {
				cell1.setCellValue(code);
				cell2.setCellValue(code);
			} else if (StringUtils.isNotBlank(caption) && StringUtils.isBlank(code)) {
				cell1.setCellValue(caption);
				cell2.setCellValue("");
			} else {
				throw new IllegalArgumentException("caption and code can't empty");
			}
		});
	}

	@Override
	public int startRow() {
		return 0;
	}

	@Override
	public int rowNum() {
		return 2;
	}

}
