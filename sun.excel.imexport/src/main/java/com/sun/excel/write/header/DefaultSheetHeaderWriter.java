package com.sun.excel.write.header;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.google.common.base.Charsets;
import com.sun.excel.ColumnField;
import com.sun.excel.SheetColumn;
import com.sun.excel.utils.ClassFieldUtil;
import com.sun.excel.utils.ExcelUtil;
import com.sun.excel.utils.Iterables;

public class DefaultSheetHeaderWriter implements SheetHeaderWriter {

	@Override
	public <T> void write(Sheet sheet, Class<T> clazz) {
		Row row = sheet.createRow(startRowIndex());
		CellStyle cellStyle = this.createRowCellStyle(sheet);

		List<ColumnField> columnFields = ClassFieldUtil.getColumnFields(clazz, SheetColumn.class);
		Iterables.forEach(columnFields, (index, columnField) -> {
			String caption = columnField.getColumnCaption();
			String code = columnField.getColumnCode();

			Cell cell = row.createCell(index);
			if (cellStyle != null) {
				cell.setCellStyle(cellStyle);
			}
			if (StringUtils.isNotBlank(caption) && StringUtils.isNotBlank(code)) {
				cell.setCellValue(String.format("%s(%s)", caption, code));
			} else if (StringUtils.isBlank(caption) && StringUtils.isNotBlank(code)) {
				cell.setCellValue(code);
			} else if (StringUtils.isNotBlank(caption) && StringUtils.isBlank(code)) {
				cell.setCellValue(caption);
			} else {
				throw new IllegalArgumentException("caption and code can't empty");
			}
		});

		// 设置列宽
		for (int i = 0, len = row.getPhysicalNumberOfCells(); i < len; i++) {
			Cell currentCell = row.getCell(i);
			int length = currentCell.toString().getBytes(Charsets.UTF_8).length;
			sheet.setColumnWidth(i, length * 256);
		}
	}

	@Override
	public CellStyle createRowCellStyle(Sheet sheet) {
		CellStyle cellStyle = ExcelUtil.getHeaderStyle(sheet.getWorkbook(), sheet);
		cellStyle.setAlignment(HorizontalAlignment.CENTER);
		return cellStyle;
	}

	@Override
	public int startRowIndex() {
		return 0;
	}

	@Override
	public int rowNum() {
		return 1;
	}

}
