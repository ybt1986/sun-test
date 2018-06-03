package com.example.demo;

import javax.servlet.Filter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.CharacterEncodingFilter;

@SpringBootApplication
public class DemoApplication {

	// 用于处理编码问题  
		@Bean
		public Filter characterEncodingFilter() {
			CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
			characterEncodingFilter.setEncoding("UTF-8");
			characterEncodingFilter.setForceEncoding(true);
			return characterEncodingFilter;
		}
		
		/**
		 * mvn打包后，需要指定内嵌tomcat的服务，否则会“找不到EmbeddedServletContainerFactory”报错
		 * 也可以使用jetty服务
		 * @return
		 */
		@Bean
		public EmbeddedServletContainerFactory servletContainer() {
			TomcatEmbeddedServletContainerFactory factory = new TomcatEmbeddedServletContainerFactory();
			return factory;
		}
		
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
