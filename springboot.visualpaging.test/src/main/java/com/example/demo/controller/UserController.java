package com.example.demo.controller;

import java.util.List;

import org.apache.commons.lang3.RandomUtils;
import org.assertj.core.util.Lists;
import org.fluttercode.datafactory.impl.DataFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.vo.UserVo;

@RestController
public class UserController {
	@RequestMapping(path = "/userList", method = { RequestMethod.GET, RequestMethod.POST })
	public List<UserVo> userList() {
		DataFactory df = new DataFactory();
		List<UserVo> userList = Lists.newArrayList();
		for (int i = 0; i < 10; i++) {
			UserVo userVo = new UserVo();
			userVo.setUserId(i);
			userVo.setUserName(df.getName());
			userVo.setAge(df.getNumberBetween(10, 40));
			userVo.setEmail(df.getEmailAddress());
			userVo.setPhone(df.getNumberText(11));
			userVo.setBirthday(df.getBirthDate());
			userVo.setRemark(df.getRandomWord(15));
			userVo.setSex(df.getItem(new String[] { "F", "M" }));
			userVo.setStature(RandomUtils.nextDouble(1.50, 2.00));

			userList.add(userVo);
		}

		return userList;
	}
}
