package com.sample.mybatis.mapper;

import com.sample.mybatis.model.DeptManager;
import com.sample.mybatis.model.DeptManagerKey;

public interface DeptManagerMapper {
    int deleteByPrimaryKey(DeptManagerKey key);

    int insert(DeptManager record);

    int insertSelective(DeptManager record);

    DeptManager selectByPrimaryKey(DeptManagerKey key);

    int updateByPrimaryKeySelective(DeptManager record);

    int updateByPrimaryKey(DeptManager record);
}