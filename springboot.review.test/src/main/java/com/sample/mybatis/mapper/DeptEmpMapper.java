package com.sample.mybatis.mapper;

import com.sample.mybatis.model.DeptEmp;
import com.sample.mybatis.model.DeptEmpKey;

public interface DeptEmpMapper {
    int deleteByPrimaryKey(DeptEmpKey key);

    int insert(DeptEmp record);

    int insertSelective(DeptEmp record);

    DeptEmp selectByPrimaryKey(DeptEmpKey key);

    int updateByPrimaryKeySelective(DeptEmp record);

    int updateByPrimaryKey(DeptEmp record);
}