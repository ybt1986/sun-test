package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.demo.cmp.ResourceConfig;

@SpringBootApplication
public class Application {
	@Bean
	public ResourceConfig cmpResourceConfig() {
		ResourceConfig config = new ResourceConfig();
		config.setStaticPath("classpath*:static");
		return config;
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
