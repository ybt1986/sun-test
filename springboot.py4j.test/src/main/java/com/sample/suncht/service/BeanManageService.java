package com.sample.suncht.service;

import java.util.Map;

import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.sample.suncht.util.SpringContextUtil;

@Service("beanManageService")
public class BeanManageService {
	public void registerBean(String beanName, Class<? extends TestService> beanClass, Map<String, Object> properties) {
		DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory) SpringContextUtil.getApplicationContext().getAutowireCapableBeanFactory();

		BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition(beanClass);
		if (properties != null) {
			properties.forEach((key, value) -> {
				beanDefinitionBuilder.addPropertyValue(key, value);
			});
		}

		// 动态注册bean.
		defaultListableBeanFactory.registerBeanDefinition(beanName, beanDefinitionBuilder.getBeanDefinition());
	}

	public void registerBean(String beanName, Class<? extends TestService> beanClass) {
		this.registerBean(beanName, beanClass, null);
	}

	public void registerBean(Class<? extends TestService> beanClass) {
		String className = beanClass.getSimpleName();
		className = StringUtils.capitalize(className);
		this.registerBean(className, beanClass, null);
	}

	public void registerObject(String objectName, Object object) {
		DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory) SpringContextUtil.getApplicationContext().getAutowireCapableBeanFactory();
		if (!defaultListableBeanFactory.containsBean(objectName)) {
			try {
				defaultListableBeanFactory.registerSingleton(objectName, object);
				defaultListableBeanFactory.autowireBean(object);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public boolean unregisterObject(String objectName) {
		DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory) SpringContextUtil.getApplicationContext().getAutowireCapableBeanFactory();

		if (defaultListableBeanFactory.containsBean(objectName)) {
			defaultListableBeanFactory.destroySingleton(objectName);
		}

		return true;
	}

}
