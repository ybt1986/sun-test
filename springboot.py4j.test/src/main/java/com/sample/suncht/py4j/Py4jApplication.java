package com.sample.suncht.py4j;

import com.sample.suncht.util.SpringContextUtil;

public class Py4jApplication {
	public Object getBean(String beanName) {
		return SpringContextUtil.getBean(beanName);
	}

}
