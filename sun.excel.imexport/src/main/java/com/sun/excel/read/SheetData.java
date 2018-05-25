package com.sun.excel.read;

import java.util.List;
import java.util.Map;

import com.sun.excel.read.header.SheetColumnHeader;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class SheetData {
	private Map<Integer, SheetColumnHeader> sheetHeader;

	private List<Map<Integer, String>> sheetData;

}
