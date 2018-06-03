package com.sun.excel.write.header;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Sheet;

public interface SheetHeaderWriter {
	<T> void write(Sheet sheet, Class<T> clazz);

	CellStyle createRowCellStyle(Sheet sheet);

	int startRowIndex();

	int rowNum();

}
