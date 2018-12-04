package com.sample.suncht.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sample.suncht.py4j.Py4jApplication;

import py4j.GatewayServer;

@Configuration
public class Py4jConfigurer {
	@Bean
	public GatewayServer gatewayServer() {
		GatewayServer server = new GatewayServer(new Py4jApplication(), 18080, 18081, 0, 0, null);
		server.start();
		return server;
	}

}
