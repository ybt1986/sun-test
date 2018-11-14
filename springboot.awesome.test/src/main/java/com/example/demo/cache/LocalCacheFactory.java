package com.example.demo.cache;

import java.util.List;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import com.example.demo.utils.MapKit;
import com.example.demo.utils.MapKit.Action;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.collect.Lists;

/**
 * 本地缓存工厂
 * 
 * @author changtan.sun
 *
 */
public class LocalCacheFactory extends BaseCacheFactory {

	private final static Cache<String, Object> localCache = CacheBuilder.newBuilder().maximumSize(10000).expireAfterWrite(60 * 12, TimeUnit.MINUTES).build();

	@Override
	public void put(String cacheName, String key, Object value) {
		localCache.put(cacheName + "-" + key, value);
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T> T get(String cacheName, String key) {
		T obj = (T) localCache.getIfPresent(cacheName + "-" + key);
		return obj;
	}

	@Override
	public List getKeys(String cacheName) {
		ConcurrentMap<String, Object> cacheMap = localCache.asMap();
		final String _cacheName = cacheName;
		final List<Object> cachedObjList = Lists.newArrayList();
		MapKit.<String, Object>foreach(cacheMap, new Action<String, Object>() {
			@Override
			public void apply(String key, Object value) {
				if (key.startsWith(_cacheName)) {
					cachedObjList.add(value);
				}
			}
		});
		return cachedObjList;
	}

	@Override
	public void remove(String cacheName, String key) {
		localCache.invalidate(cacheName + "-" + key);
	}

	@Override
	public void removeAll(String cacheName) {
		localCache.invalidateAll();
	}

}
