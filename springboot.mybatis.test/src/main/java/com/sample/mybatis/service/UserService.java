package com.sample.mybatis.service;

import java.util.List;

import com.github.pagehelper.PageInfo;
import com.sample.mybatis.model.User;
import com.sample.mybatis.page.PageParam;

public interface UserService {
	public List<User> getAllUser();
	
	public User getUserById(Integer id) ;

	public PageInfo<User> getUserListByPagination(PageParam pageParam);
}
