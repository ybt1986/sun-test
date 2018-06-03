package com.sun.excel.write.header;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.sun.excel.SheetColumnFieldCfg;
import com.sun.excel.SheetTableCfg;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.SheetColumnIndexStrategy;
import com.sun.excel.utils.Iterables;
import com.sun.excel.utils.ReflectUtils;

public class DefaultSheetHeaderWriter extends BaseSheetHeaderWriter {

	@Override
	public <T> void write(Sheet sheet, Class<T> clazz) {
		Row row = sheet.createRow(startRowIndex());
		CellStyle cellStyle = this.createRowCellStyle(sheet);

		SheetTableCfg tableCfg = ReflectUtils.getTableCfg(clazz);
		SheetColumnIndexStrategy columnIndexStrategy = SheetColumnIndexStrategyRegistrar.newSheetColumnIndexStrategy(tableCfg.getColumnIndexStrategy());

		List<SheetColumnFieldCfg> columnFieldCfgs = ReflectUtils.getColumnFieldCfgs(clazz);
		int columnCount = columnFieldCfgs.size();
		Iterables.forEach(columnFieldCfgs, (index, columnFieldCfg) -> {
			String caption = columnFieldCfg.getColumnCaption();
			String code = columnFieldCfg.getColumnCode();

			int realIndex = columnIndexStrategy.findColumnIndex(columnFieldCfg, index, columnCount);
			Cell cell = row.getCell(realIndex);
			if (cell == null) {
				cell = row.createCell(realIndex);
			}

			if (cellStyle != null) {
				cell.setCellStyle(cellStyle);
			}
			if (StringUtils.isNotBlank(caption) && StringUtils.isNotBlank(code)) {
				cell.setCellValue(String.format("%s(%s)", caption, code));
			} else if (StringUtils.isBlank(caption) && StringUtils.isNotBlank(code)) {
				cell.setCellValue(code);
			} else if (StringUtils.isNotBlank(caption) && StringUtils.isBlank(code)) {
				cell.setCellValue(caption);
			} else {
				throw new IllegalArgumentException("caption and code can't empty");
			}
		});

		// // 设置列宽
		// for (int i = 0, len = row.getPhysicalNumberOfCells(); i < len; i++) {
		// Cell currentCell = row.getCell(i);
		// if(currentCell==null) {
		// continue;
		// }
		// int length = currentCell.toString().getBytes(Charsets.UTF_8).length;
		// sheet.setColumnWidth(i, length * 256);
		// }
	}
}
