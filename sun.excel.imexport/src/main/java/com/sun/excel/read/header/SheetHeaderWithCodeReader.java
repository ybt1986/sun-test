package com.sun.excel.read.header;

import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.sun.excel.utils.ExcelUtil;
import com.sun.excel.utils.Iterables;

public class SheetHeaderWithCodeReader implements SheetHeaderReader {

	@Override
	public Map<Integer, SheetColumnHeader> read(final Sheet sheet) {
		Preconditions.checkArgument(sheet.getPhysicalNumberOfRows() >= 2);

		Row rowCaption = sheet.getRow(0);
		Row rowCode = sheet.getRow(1);

		Preconditions.checkNotNull(rowCaption != null);
		Preconditions.checkNotNull(rowCode != null);

		Map<Integer, SheetColumnHeader> map = Maps.newHashMap();

		Iterables.forEach(rowCaption, (index, cellCaption) -> {
			String cellCaptionValue = ExcelUtil.getCellValue(cellCaption);
			String cellCodeValue = ExcelUtil.getCellValue(rowCode.getCell(index));

			SheetColumnHeader header = SheetColumnHeader.builder().caption(cellCaptionValue).code(cellCodeValue).index(index).build();
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
		return 2;
	}

}
