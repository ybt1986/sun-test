package com.sun.excel.write.header;

import org.apache.poi.ss.usermodel.Sheet;

public interface SheetHeaderWriter {
	<T> void write(Sheet sheet, Class<T> clazz);

	int startRow();

	int rowNum();
}
