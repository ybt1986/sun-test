package com.sample.mybatis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.github.pagehelper.PageInfo;
import com.sample.mybatis.common.BaseController;
import com.sample.mybatis.model.User;
import com.sample.mybatis.page.PageParam;
import com.sample.mybatis.service.UserService;

@Controller
@RequestMapping("/user")
public class UserController extends BaseController {
	@Autowired
	private UserService userService;

	@RequestMapping("/{id}")
	@ResponseBody
	public User getUser(@PathVariable("id") Integer id) {
		return userService.getUserById(id);
	}

	@RequestMapping("/all")
	@ResponseBody
	public List<User> getAllUser() {
		return userService.getAllUser();
	}

	@RequestMapping("/query")
	@ResponseBody
	public PageInfo<User> getUserListByPagination(PageParam pageParam) {
		PageInfo<User> userList = userService.getUserListByPagination(pageParam);
		return userList;
	}

	@RequestMapping("/index")
	public ModelAndView index(ModelAndView mv) {
		mv.addObject("title", "欢迎使用Thymeleaf!");
		mv.setViewName("/greeting");
		return mv;
	}
}
