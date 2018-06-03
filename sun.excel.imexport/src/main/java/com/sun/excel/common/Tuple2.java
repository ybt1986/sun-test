package com.sun.excel.common;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class Tuple2<K, V> {
	private K value1;
	private V value2;

}
