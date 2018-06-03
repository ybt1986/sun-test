package com.sun.excel.write.header;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Sheet;

import com.sun.excel.utils.ExcelUtil;

public abstract class BaseSheetHeaderWriter implements SheetHeaderWriter {
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
