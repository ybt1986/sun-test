package com.sample.mybatis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.sample.mybatis.common.BaseController;
import com.sample.mybatis.model.User;
import com.sample.mybatis.page.PageParam;
import com.sample.mybatis.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController extends BaseController {
	@Autowired
	private UserService userService;
	
	@RequestMapping("/{id}")
	public User getUser(@PathVariable("id") Integer id) {
		return userService.getUserById(id);
	}
	
	@RequestMapping("/all")
	public List<User> getAllUser() {
		return userService.getAllUser();
	}
	
	@RequestMapping("/query")
	public PageInfo<User> getUserListByPagination(PageParam pageParam) {
		PageInfo<User> userList = userService.getUserListByPagination(pageParam);
		return userList;
	}
}
