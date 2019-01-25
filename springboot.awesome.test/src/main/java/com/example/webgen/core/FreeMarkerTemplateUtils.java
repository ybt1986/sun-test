package com.example.webgen.core;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.NullCacheStorage;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;

public class FreeMarkerTemplateUtils {
	private static final Logger logger = LoggerFactory.getLogger(FreeMarkerTemplateUtils.class);

	private FreeMarkerTemplateUtils() {
	}

	private static final Configuration CONFIGURATION = new Configuration(Configuration.VERSION_2_3_28);

	static {
		// 这里比较重要，用来指定加载模板所在的路径
		CONFIGURATION.setTemplateLoader(new ClassTemplateLoader(FreeMarkerTemplateUtils.class, "/webtpl"));
		CONFIGURATION.setDefaultEncoding("UTF-8");
		CONFIGURATION.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
		CONFIGURATION.setCacheStorage(NullCacheStorage.INSTANCE);
	}

	public static Template getTemplate(String templateName) {
		try {
			return CONFIGURATION.getTemplate(templateName);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}

		return null;
	}

	public static void clearCache() {
		CONFIGURATION.clearTemplateCache();
	}
}