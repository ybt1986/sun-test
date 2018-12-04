package com.example.demo.utils;

import java.util.Map;

/**
 * Map集合类的工具
 * 
 * @author changtan.sun
 *
 */
public class MapKit {
	/**
	 * 遍历Map
	 * 
	 * @param map
	 * @param action
	 */
	public static <K, V> void foreach(Map<K, V> map, Action<K, V> action) {
		if (map == null) {
			return;
		}

		for (Map.Entry<K, V> entry : map.entrySet()) {
			action.apply(entry.getKey(), entry.getValue());
		}
	}

	/**
	 * 遍历Map的元素操作的接口
	 * 
	 * @author changtan.sun
	 *
	 * @param <K>
	 * @param <V>
	 */
	public static interface Action<K, V> {
		public void apply(K key, V value);
	}
}
