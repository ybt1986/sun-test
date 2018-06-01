package com.sun.excel.read.header;

import java.util.Map;

import org.apache.poi.ss.usermodel.Sheet;

public interface SheetHeaderReader {
	Map<Integer, SheetColumnHeader> read(Sheet sheet);

	int startRowIndex();

	int rowNum();
}
