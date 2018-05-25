package com.sun.excel.read.body;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Row;

import com.google.common.collect.Maps;
import com.sun.excel.utils.ExcelUtil;
import com.sun.excel.utils.Iterables;

public class DefaultDataRowReader implements DataRowReader {

	@Override
	public Map<Integer, String> read(Row row) {
		Map<Integer, String> data = Maps.newHashMap();

		Iterables.forEach(row, (index, cell) -> {
			String value = ExcelUtil.getCellValue(cell);
			data.put(index, value);
		});

		return validData(data) ? data : null;
	}

	private boolean validData(Map<Integer, String> data) {
		return data.values().stream().filter(value -> value != null && StringUtils.isNotBlank(value)).findFirst().isPresent();
	}

}
