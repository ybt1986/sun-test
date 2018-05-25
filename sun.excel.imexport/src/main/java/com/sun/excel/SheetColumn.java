package com.sun.excel;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target( { java.lang.annotation.ElementType.FIELD })
public @interface SheetColumn {
	String caption() default "";
	String code() default "";
	String index() default "A";
	SheetColumnDataType datatype() default SheetColumnDataType.STRING;
	String format() default "";
}
