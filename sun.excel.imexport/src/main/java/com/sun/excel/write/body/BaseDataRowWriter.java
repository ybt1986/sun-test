package com.sun.excel.write.body;

import com.sun.excel.write.header.SheetHeaderWriter;

public abstract class BaseDataRowWriter implements DataRowWriter {
	private SheetHeaderWriter headerWriter;
	
	@Override
	public int getRowNum() {
		return 1;
	}

	@Override
	public SheetHeaderWriter getHeaderWriter() {
		return headerWriter;
	}

	@Override
	public void setHeaderWriter(SheetHeaderWriter headerWriter) {
		this.headerWriter = headerWriter;
	}

}
