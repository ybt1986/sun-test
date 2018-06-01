package com.sun.excel.write.body;

import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;

import com.sun.excel.ColumnField;
import com.sun.excel.SheetColumn;
import com.sun.excel.common.CellTypeFormatRegistrar;
import com.sun.excel.common.CellTypeFormatRegistrar.CellFieldValueFormat;
import com.sun.excel.utils.ClassFieldUtil;
import com.sun.excel.utils.Iterables;

public class DefaultDataRowWriter extends BaseDataRowWriter {
	@Override
	public <T> void write(Row row, CellStyle cellStyle, T data, Class<T> clazz) {

		List<ColumnField> columnFields = ClassFieldUtil.getColumnFields(clazz, SheetColumn.class);
		Iterables.forEach(columnFields, (index, columnField) -> {
			Object value = ClassFieldUtil.getFieldValue(data, columnField.getColumnCode(), clazz);
			Cell cell = row.createCell(index);

			// CellStyle cellStyle = createCellStyle(row);
			if (cellStyle != null) {
				cell.setCellStyle(cellStyle);
			}

			CellFieldValueFormat<?> formatter = CellTypeFormatRegistrar.getCellFieldValueFormat(columnField.getColumnFormat());
			formatter.write(cell, value);
		});
	}
}
