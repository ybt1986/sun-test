package com.sun.excel.write.body;

import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;

import com.sun.excel.SheetColumnFieldCfg;
import com.sun.excel.SheetTableCfg;
import com.sun.excel.common.CellTypeFormatRegistrar;
import com.sun.excel.common.CellTypeFormatRegistrar.CellFieldValueFormat;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.SheetColumnIndexStrategy;
import com.sun.excel.utils.Iterables;
import com.sun.excel.utils.ReflectUtils;

public class DefaultDataRowWriter extends BaseDataRowWriter {

	@Override
	public <T> void write(Row row, CellStyle cellStyle, T data, Class<T> clazz) {

		SheetTableCfg tableCfg = ReflectUtils.getTableCfg(clazz);
		SheetColumnIndexStrategy columnIndexStrategy = SheetColumnIndexStrategyRegistrar.newSheetColumnIndexStrategy(tableCfg.getColumnIndexStrategy());

		List<SheetColumnFieldCfg> columnFieldCfgs = ReflectUtils.getColumnFieldCfgs(clazz);
		int columnCount = columnFieldCfgs.size();
		Iterables.forEach(columnFieldCfgs, (index, columnFieldCfg) -> {
			Object value = ReflectUtils.getFieldValue(data, columnFieldCfg.getColumnCode(), clazz);

			int realIndex = columnIndexStrategy.findColumnIndex(columnFieldCfg, index, columnCount);
			Cell cell = row.getCell(realIndex);
			if (cell == null) {
				cell = row.createCell(realIndex);
			}

			// CellStyle cellStyle = createCellStyle(row);
			if (cellStyle != null) {
				cell.setCellStyle(cellStyle);
			}

			CellFieldValueFormat<?> format = CellTypeFormatRegistrar.getCellFieldValueFormat(columnFieldCfg.getColumnFormat());
			format.write(cell, value);
		});
	}
}
