package com.sample.mybatis.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PageParam {
	/**
	 * 每页记录数
	 */
    private int pageSize = 10;
    
    /**
     * 当前页码
     */
    private int pageNo = 1;
    
    /**
     * 排序字段
     */
    private String sortField;
    
    /**
     * 排序顺序
     */
    private String order;
}
