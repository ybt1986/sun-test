package com.sun.excel.read.body;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Sheet;

public interface SheetBodyReader {
	List<Map<Integer, String>> read(Sheet sheet);

	void startRowIndex(int startRowIndex);
}
