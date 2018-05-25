package com.sun.excel.demo;

public enum Sex {
	MALE("男"), FEMALE("女");

	private String desc;// 中文描述

	private Sex(String desc) {
		this.desc = desc;
	}

	public String getDesc() {
		return desc;
	}

	public static Sex parse(String value) {
		if ("男".equals(value)) {
			return Sex.MALE;
		} else if ("女".equals(value)) {
			return Sex.FEMALE;
		} else {
			return Sex.MALE;
		}
	}
}
