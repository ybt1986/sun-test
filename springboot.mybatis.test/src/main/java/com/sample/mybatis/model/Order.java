package com.sample.mybatis.model;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class Order {
	private String orderId;
	private String userId;
	private Date placeTime;
	private List<Production> productions;
}
