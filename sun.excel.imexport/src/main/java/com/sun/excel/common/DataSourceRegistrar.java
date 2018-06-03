package com.sun.excel.common;

import java.util.List;
import java.util.Map;

import com.google.common.collect.Maps;

/**
 * 数据源注册
 * 
 * @author suncht
 *
 */
public class DataSourceRegistrar {
	private static Map<String, List<?>> dataSourceRegistry = Maps.newConcurrentMap();

	public static void registerDataSource(String type, List<?> dataSource) {
		DataSourceRegistrar.dataSourceRegistry.put(type, dataSource);
	}

	public static void unregisterDataSource(String type) {
		List<?> dataSouce = DataSourceRegistrar.dataSourceRegistry.remove(type);
		if (dataSouce != null) {
			dataSouce.clear();
			dataSouce = null;
		}
	}

	public static List<?> getCellFieldValueFormat(String type) {
		List<?> dataSource = DataSourceRegistrar.dataSourceRegistry.get(type);
		return dataSource;
	}
}
