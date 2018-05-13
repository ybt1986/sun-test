package com.suncht.sample.test;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import com.suncht.sample.model.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class WebTest {
	private WebClient client = null;
	@Before
	public void init() {
		client = WebClient.create("http://127.0.0.1:8080/");
	}
	
	@Test
	public void testUserById() {
		Mono<User> result = client.get()// 请求方法,get,post...
				.uri("users/{id}", "1")// 请求相对地址以及参数
				.accept(MediaType.APPLICATION_JSON).retrieve()// 请求类型
				.bodyToMono(User.class);// 返回类型
		User user = result.block();
		System.out.println(user);
	}
	
	@Test
	public void testUserById2() {
		Mono<User> result2 = client.get()// 请求方法,get,post...
				.uri("api/user/{id}", "1")// 请求相对地址以及参数
				.accept(MediaType.APPLICATION_JSON).retrieve()// 请求类型
				.bodyToMono(User.class);// 返回类型
		User user2 = result2.block();
		System.out.println(user2);
	}
	
	@Test
	public void testAllUsers() {
		Flux<User> userFlux = client.get()
				.uri("users/")
				.accept(MediaType.APPLICATION_JSON).retrieve()// 请求类型
				.bodyToFlux(User.class);// 返回类型
		
		List<User> users = userFlux.collectList().block();
		System.out.println(users);
	}
	
}
