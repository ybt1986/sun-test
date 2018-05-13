package com.suncht.sample.handler;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.suncht.sample.model.User;
import com.suncht.sample.service.UserRepository;

import reactor.core.publisher.Mono;

/**
 * UserHandler
 * 用户操作的业务逻辑
 * @author suncht
 *
 */
@Service
public class UserHandler {
	@Autowired
	private UserRepository userRepository;
	

	public Mono<ServerResponse> handleGetUserById(ServerRequest request) {
		Long userId = Long.valueOf(request.pathVariable("id"));
		Optional<User> user = userRepository.findById(userId);
		return ServerResponse.ok().body(Mono.just(user.get()), User.class)
				.switchIfEmpty(ServerResponse.notFound().build());
	}	
}