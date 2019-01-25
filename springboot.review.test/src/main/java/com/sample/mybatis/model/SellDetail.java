package com.sample.mybatis.model;

import java.util.List;

import lombok.Data;

/**
 * 销售明细
 * 
 * @author sunchangtan
 *
 */
@Data
public class SellDetail {
	private long sellId;
	private String userNo;
	private User user;
	private List<Order> orders;
}
