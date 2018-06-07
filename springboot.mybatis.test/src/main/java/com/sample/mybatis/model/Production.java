package com.sample.mybatis.model;

import lombok.Data;

@Data
public class Production {
	private String skuId;
	private String proId;
	private String name;
	private double price;
	private int number;
}
