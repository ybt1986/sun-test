package com.sun.excel.write.body;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.sun.excel.write.header.DefaultSheetHeaderWriter;
import com.sun.excel.write.header.SheetHeaderWriter;

public abstract class BaseSheetBodyWriter implements SheetBodyWriter {
	protected SheetHeaderWriter headerWriter;

	@Override
	public CellStyle createRowCellStyle(Sheet sheet) {
		Workbook workbook = sheet.getWorkbook();

		CellStyle cellStyle = workbook.createCellStyle();
		// 居中
		cellStyle.setAlignment(HorizontalAlignment.LEFT);

		// // 文本格式
		// DataFormat dataFormat = workbook.createDataFormat();
		// cellStyle.setDataFormat(dataFormat.getFormat("@"));

		return cellStyle;
	}

	@Override
	public void setHeaderWriter(SheetHeaderWriter headerWriter) {
		if (headerWriter == null) {
			headerWriter = new DefaultSheetHeaderWriter();
		}
		this.headerWriter = headerWriter;
	}

}
