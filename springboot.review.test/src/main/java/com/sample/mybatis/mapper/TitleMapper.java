package com.sample.mybatis.mapper;

import com.sample.mybatis.model.Title;
import com.sample.mybatis.model.TitleKey;

public interface TitleMapper {
    int deleteByPrimaryKey(TitleKey key);

    int insert(Title record);

    int insertSelective(Title record);

    Title selectByPrimaryKey(TitleKey key);

    int updateByPrimaryKeySelective(Title record);

    int updateByPrimaryKey(Title record);
}