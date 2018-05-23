package com.sample.mybatis;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.sample.mybatis.mapper")
public class MybatisTestApplication {
	public static void main(String[] args) throws Exception {
		SpringApplication.run(MybatisTestApplication.class, args);
	}
}
