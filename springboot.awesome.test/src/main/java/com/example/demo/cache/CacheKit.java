package com.example.demo.cache;

/**
 * 缓存工具类
 * 
 * @author changtan.sun
 */
public class CacheKit {

	/**
	 * 本地缓存
	 * 
	 * @return
	 */
	public static ICache getLocalCache() {
		return new LocalCacheFactory();
	}

}
