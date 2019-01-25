package com.sample.mybatis.mapper;

import com.sample.mybatis.model.Department;

public interface DepartmentMapper {
    int deleteByPrimaryKey(String deptNo);

    int insert(Department record);

    int insertSelective(Department record);

    Department selectByPrimaryKey(String deptNo);

    int updateByPrimaryKeySelective(Department record);

    int updateByPrimaryKey(Department record);
}