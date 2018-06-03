package com.sun.excel.write.header;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.google.common.base.Charsets;
import com.sun.excel.SheetColumnFieldCfg;
import com.sun.excel.SheetTableCfg;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.SheetColumnIndexStrategy;
import com.sun.excel.utils.ExcelUtil;
import com.sun.excel.utils.Iterables;
import com.sun.excel.utils.ReflectUtils;

public class SheetHeaderWithCodeWriter extends BaseSheetHeaderWriter {

	@Override
	public <T> void write(Sheet sheet, Class<T> clazz) {
		CellStyle cellStyle = this.createRowCellStyle(sheet);

		Row row1 = sheet.createRow(startRowIndex());
		Row row2 = sheet.createRow(startRowIndex() + 1);

		SheetTableCfg tableCfg = ReflectUtils.getTableCfg(clazz);
		SheetColumnIndexStrategy columnIndexStrategy = SheetColumnIndexStrategyRegistrar.newSheetColumnIndexStrategy(tableCfg.getColumnIndexStrategy());

		List<SheetColumnFieldCfg> columnFieldCfgs = ReflectUtils.getColumnFieldCfgs(clazz);
		int columnCount = columnFieldCfgs.size();
		Iterables.forEach(columnFieldCfgs, (index, columnFieldCfg) -> {
			String caption = columnFieldCfg.getColumnCaption();
			String code = columnFieldCfg.getColumnCode();

			int realIndex = columnIndexStrategy.findColumnIndex(columnFieldCfg, index, columnCount);
			Cell cell1 = row1.getCell(realIndex);
			if (cell1 == null) {
				cell1 = row1.createCell(realIndex);
			}
			Cell cell2 = row2.getCell(realIndex);
			if (cell2 == null) {
				cell2 = row2.createCell(realIndex);
			}

			if (cellStyle != null) {
				cell1.setCellStyle(cellStyle);
				cell2.setCellStyle(cellStyle);
			}
			if (StringUtils.isNotBlank(caption) && StringUtils.isNotBlank(code)) {
				cell1.setCellValue(caption);
				cell2.setCellValue(code);
			} else if (StringUtils.isBlank(caption) && StringUtils.isNotBlank(code)) {
				cell1.setCellValue(code);
				cell2.setCellValue(code);
			} else if (StringUtils.isNotBlank(caption) && StringUtils.isBlank(code)) {
				cell1.setCellValue(caption);
				cell2.setCellValue("");
			} else {
				throw new IllegalArgumentException("caption and code can't empty");
			}
		});

		// 设置列宽
		for (int i = 0, len = row1.getPhysicalNumberOfCells(); i < len; i++) {
			Cell cell1 = row1.getCell(i);
			Cell cell2 = row2.getCell(i);
			int length1 = cell1.toString().getBytes(Charsets.UTF_8).length;
			int length2 = cell2.toString().getBytes(Charsets.UTF_8).length;

			sheet.setColumnWidth(i, Math.max(length1, length2) * 512);
		}
	}

	@Override
	public CellStyle createRowCellStyle(Sheet sheet) {
		CellStyle cellStyle = ExcelUtil.getHeaderStyle(sheet.getWorkbook(), sheet);
		cellStyle.setAlignment(HorizontalAlignment.CENTER);
		sheet.setDefaultColumnWidth(20);
		return cellStyle;
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
