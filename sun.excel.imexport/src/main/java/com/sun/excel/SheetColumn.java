package com.sun.excel;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ java.lang.annotation.ElementType.FIELD })
public @interface SheetColumn {
	/**
	 * 列标题
	 * 
	 * @return
	 */
	String caption();

	/**
	 * 列编码
	 * 
	 * @return
	 */
	String code() default "";

	/**
	 * 列索引
	 * 
	 * @return
	 */
	int index() default Integer.MIN_VALUE;

	/**
	 * 导入Excel时，数据格式化
	 * 
	 * @return
	 */
	String format() default "string";

	/**
	 * 数据源
	 */
	String dataSource() default "";

	/**
	 * 是否需要多列显示
	 * 
	 * @return
	 */
	boolean mulcol() default false;
}
