package com.sun.excel.write.body;

import java.util.List;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Sheet;

import com.sun.excel.write.header.SheetHeaderWriter;

public interface SheetBodyWriter {
	<T> void write(Sheet sheet, List<T> datas, Class<T> clazz);

	void startRowIndex(int startRowIndex);

	CellStyle createRowCellStyle(Sheet sheet);
	
	SheetHeaderWriter getHeaderWriter();

	void setHeaderWriter(SheetHeaderWriter headerWriter);
	
	DataRowWriter getDataRowWriter();

	void setDataRowWriter(DataRowWriter dataRowWriter);
}
