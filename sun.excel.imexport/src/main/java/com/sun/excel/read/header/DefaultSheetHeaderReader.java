package com.sun.excel.read.header;

import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.sun.excel.utils.ExcelUtil;
import com.sun.excel.utils.Iterables;

public class DefaultSheetHeaderReader implements SheetHeaderReader {

	@Override
	public Map<Integer, SheetColumnHeader> read(Sheet sheet) {
		Preconditions.checkArgument(sheet.getPhysicalNumberOfRows() >= 2);

		Row rowCaption = sheet.getRow(0);

		Preconditions.checkNotNull(rowCaption != null);

		Map<Integer, SheetColumnHeader> map = Maps.newHashMap();

		Iterables.forEach(rowCaption, (index, cellCaption) -> {
			String cellCaptionValue = ExcelUtil.getCellValue(cellCaption);

			SheetColumnHeader header = SheetColumnHeader.builder().caption(cellCaptionValue).code(cellCaptionValue).index(index).build();
			map.put(index, header);
		});

		return map;
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
