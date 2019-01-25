package com.sample.mybatis.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseResult {
	public static final int SUCCESS = 1;
	public static final int FAILURE = 0;

	public int code;
	private String msg;
	private Object data;

}
