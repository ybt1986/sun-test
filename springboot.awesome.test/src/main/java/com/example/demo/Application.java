package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.example.demo.cmp.ResourceConfig;
import com.example.demo.cmp.reader.FilePreheater;
import com.example.demo.servlet.ResourceServlet;

@SpringBootApplication
public class Application {
	@Bean
    public ServletRegistrationBean resourceServlet(){
        return new ServletRegistrationBean(new ResourceServlet(),"/resource/*");
    }
	
	@Bean
	public ResourceConfig cmpResourceConfig() {
		ResourceConfig config = new ResourceConfig();
		config.setEnableCache(true);
		config.setEnableMin(true);
		config.setEnableCompress(true);
		config.setStaticPath("classpath*:static");
//		config.setContextPath("/test");
		return config;
	}
	
	@Bean 
	public FilePreheater filePreheater() {
		FilePreheater preheater = new FilePreheater();
		preheater.preheat();
		return preheater;
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
