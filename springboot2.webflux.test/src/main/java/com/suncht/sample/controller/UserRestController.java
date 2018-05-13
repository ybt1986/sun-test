package com.suncht.sample.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.suncht.sample.model.User;
import com.suncht.sample.service.UserRepository;

/**
 * WebFlux的第一种方式： annotation-based（注解）
 * @author suncht
 *
 */
@RestController
@RequestMapping("/users")
public class UserRestController {
	@Autowired
	private UserRepository userRepository;

	@GetMapping("/")
	public List<User> getAllUser() {
		return userRepository.findAll();
	}
	
	@GetMapping("/{id}")
	public User getUser(@PathVariable Long id) {
		Optional<User> user = userRepository.findById(id);
		return user.get();
	}

	@GetMapping("/add/{userName}/{age}")
	public Long getUser(@PathVariable("userName") String userName, @PathVariable("age") Integer age) {
		User user = new User();
		user.setUserName(userName);
		user.setAge(age);
		User result = userRepository.save(user);

		return result.getId();
	}

}
