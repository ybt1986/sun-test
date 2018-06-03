package com.sun.excel;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE })
public @interface SheetTable {
	/**
	 * Sheet名称
	 * 
	 * @return
	 */
	String caption() default "";

	/**
	 * Sheet编号
	 * 
	 * @return
	 */
	String code() default "";

	/**
	 * 列索引策略
	 * 
	 * @return
	 */
	String indexStrategy() default "";
}
