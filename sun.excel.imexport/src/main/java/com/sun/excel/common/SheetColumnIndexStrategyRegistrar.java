package com.sun.excel.common;

import java.util.Map;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;
import com.sun.excel.SheetColumnFieldCfg;

/**
 * Sheet的列索引策略的注册
 * 
 * @author suncht
 *
 */
public class SheetColumnIndexStrategyRegistrar {
	private static Map<String, Class<? extends SheetColumnIndexStrategy>> sheetColumnIndexStrategyRegistry = Maps.newConcurrentMap();

	static {
		sheetColumnIndexStrategyRegistry.put("sequence", SequenceSheetColumnIndexStrategy.class);
	}

	public static void registerSheetColumnIndexStrategy(String type, Class<SheetColumnIndexStrategy> sheetColumnIndexStrategy) {
		SheetColumnIndexStrategyRegistrar.sheetColumnIndexStrategyRegistry.put(type, sheetColumnIndexStrategy);
	}

	public static SheetColumnIndexStrategy newSheetColumnIndexStrategy(String type) {
		Class<? extends SheetColumnIndexStrategy> strategyClass = SheetColumnIndexStrategyRegistrar.sheetColumnIndexStrategyRegistry.get(type);
		SheetColumnIndexStrategy strategy = null;
		try {
			strategy = strategyClass.newInstance();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}

		return strategy != null ? strategy : new SequenceSheetColumnIndexStrategy();
	}

	/**
	 * Sheet的列索引策略
	 * 
	 * @author suncht
	 *
	 */
	public static interface SheetColumnIndexStrategy {
		int findColumnIndex(SheetColumnFieldCfg columnFieldCfg, int currentIndex, int columnCount);
	}

	/**
	 * 默认的列索引策略（顺序策略）
	 * 如果遇到列ColumnField.columnIndex值是大于-1，则该列索引是ColumnField.columnIndex，下一个列索引按ColumnField.columnIndex自动递增
	 * 
	 * @author suncht
	 *
	 */
	public static class SequenceSheetColumnIndexStrategy implements SheetColumnIndexStrategy {
		private int currentMaxIndex = -1;

		@Override
		public int findColumnIndex(SheetColumnFieldCfg columnField, int currentIndex, int columnCount) {
			int realIndex = currentMaxIndex + 1;
			if (columnField.getColumnIndex() > -1) {
				realIndex = columnField.getColumnIndex();
			}

			currentMaxIndex = realIndex;

			return currentMaxIndex;
		}
	}

	/**
	 * 填充式列索引策略
	 * 
	 * @author suncht
	 *
	 */
	public static class FillingSheetColumnIndexStrategy implements SheetColumnIndexStrategy {
		private int[] bitMap = null;

		@Override
		public int findColumnIndex(SheetColumnFieldCfg columnField, int currentIndex, int columnCount) {
			Preconditions.checkArgument(columnField.getColumnIndex() < columnCount, "index超过了最大列数");

			if (bitMap == null) {
				bitMap = new int[columnCount];
				for (int i = 0; i < columnCount; i++) {
					bitMap[i] = 0;
				}
			}

			int realIndex = recurFindIndex(bitMap, columnField.getColumnIndex(), columnCount);
			return realIndex;
		}

		private int recurFindIndex(final int[] bitMap, int index, int size) {
			if (index >= size) {
				return -1;
			}

			if (index == -1) {
				index = 0;
			}

			int realIndex = -1;
			if (bitMap[index] == 0) {
				bitMap[index] = 1;
				realIndex = index;
			} else {
				realIndex = recurFindIndex(bitMap, index + 1, size);
			}

			return realIndex;
		}
	}
}
