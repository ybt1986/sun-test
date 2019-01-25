package com.sample.mybatis.mapper;

import java.util.List;
import java.util.Map;

import com.sample.mybatis.model.User;

/**
 * UserMapperExt继承UserMapper
 * @author sunchangtan
 *
 */
public interface UserMapperExt extends UserMapper {
	List<User> findAllUser(Map<String, Object> params);
}
