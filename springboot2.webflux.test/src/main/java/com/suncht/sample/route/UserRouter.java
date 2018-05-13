package com.suncht.sample.route;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;

import com.suncht.sample.handler.UserHandler;

/**
 * WebFlux的第二种方式： functional（java方法）
 * Router路由，其实就是用代码实现http请求路径，类似于Python Web框架django，手动编写路由代码
 * @author suncht
 *
 */
@Configuration
public class UserRouter {
	@Bean
	public RouterFunction<?> routerFunction(UserHandler userHandler) {
		return RouterFunctions
				.route(RequestPredicates.GET("/api/user/{id}")
				.and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), userHandler::handleGetUserById);
	}
}
