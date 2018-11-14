package com.example.demo.cache;

import java.util.List;

/**
 * 通用缓存接口
 */
public interface ICache {

	void put(String cacheName, String key, Object value);

	<T> T get(String cacheName, String key);

	@SuppressWarnings("rawtypes")
	List getKeys(String cacheName);

	void remove(String cacheName, String key);

	void removeAll(String cacheName);

	<T> T get(String cacheName, String key, ILoader iLoader);

	<T> T get(String cacheName, String key, Class<? extends ILoader> iLoaderClass);

}
