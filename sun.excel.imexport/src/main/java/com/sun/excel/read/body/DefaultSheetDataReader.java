package com.sun.excel.read.body;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.google.common.collect.Lists;

public class DefaultSheetDataReader implements SheetDataReader {
	private DataRowReader dataRowReader;
	private int startRowIndex;

	public DefaultSheetDataReader() {
		this.dataRowReader = new DefaultDataRowReader();
	}

	public DefaultSheetDataReader(DataRowReader dataRowReader) {
		this.dataRowReader = dataRowReader;
	}

	@Override
	public List<Map<Integer, String>> read(Sheet sheet) {
		List<Map<Integer, String>> data = Lists.newArrayList();

		int rowNum = sheet.getPhysicalNumberOfRows();
		if (rowNum > 0) {
			for (int i = startRowIndex; i < rowNum; i++) {
				Row row = sheet.getRow(i);
				Map<Integer, String> rowData = dataRowReader.read(row);
				if (rowData != null) {
					data.add(rowData);
				}
			}
		}

		return data;
	}

	@Override
	public void startRowIndex(int startRowIndex) {
		this.startRowIndex = startRowIndex;
	}

}
