package com.sample.mybatis.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Maps;
import com.sample.mybatis.mapper.UserMapperExt;
import com.sample.mybatis.model.User;
import com.sample.mybatis.page.PageParam;
import com.sample.mybatis.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	private UserMapperExt userMapper;

	@Override
	public User getUserById(Integer id) {
		return userMapper.selectByPrimaryKey(id);
	}

	@Override
	public List<User> getAllUser() {
		return userMapper.findAllUser(Maps.newHashMap());
	}

	@Override
	public PageInfo<User> getUserListByPagination(PageParam pageParam) {
		PageHelper.startPage(pageParam.getPageNo(), pageParam.getPageSize());
		Map<String, Object> params = Maps.newHashMap();
		params.put("sortField", pageParam.getSortField());
		params.put("order", pageParam.getOrder());
		
		List<User> users = userMapper.findAllUser(params);
		PageInfo<User> userList = new PageInfo<User>(users);  
		return userList;
	}

}
