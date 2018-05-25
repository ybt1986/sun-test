package com.sun.excel.read.body;

import java.util.Map;

import org.apache.poi.ss.usermodel.Row;

public interface DataRowReader {
	Map<Integer, String> read(Row row);

}
