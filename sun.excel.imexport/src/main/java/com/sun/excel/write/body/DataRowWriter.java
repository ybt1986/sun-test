package com.sun.excel.write.body;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;

import com.sun.excel.write.header.SheetHeaderWriter;

public interface DataRowWriter {
	public <T> void write(Row row, CellStyle cellStyle, T data, Class<T> clazz);

	public int getRowNum();
	
	public SheetHeaderWriter getHeaderWriter();

	void setHeaderWriter(SheetHeaderWriter headerWriter);

}
