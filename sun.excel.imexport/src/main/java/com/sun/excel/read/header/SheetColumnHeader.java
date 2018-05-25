package com.sun.excel.read.header;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter
@Setter
@ToString
public class SheetColumnHeader {
	private String caption;
	private String code;
	private int index;
}
