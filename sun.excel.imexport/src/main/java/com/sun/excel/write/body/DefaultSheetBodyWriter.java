package com.sun.excel.write.body;

import java.util.List;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.sun.excel.utils.Iterables;

public class DefaultSheetBodyWriter extends BaseSheetBodyWriter {
	private int startRowIndex;

	@Override
	public <T> void write(Sheet sheet, List<T> datas, Class<T> clazz) {
		CellStyle cellStyle = createRowCellStyle(sheet);

		Iterables.forEach(datas, (index, data) -> {
			Row row = sheet.createRow(startRowIndex + index);
			this.getDataRowWriter().write(row, cellStyle, data, clazz);
		});
	}

	@Override
	public void startRowIndex(int startRowIndex) {
		this.startRowIndex = startRowIndex;
	}
}
