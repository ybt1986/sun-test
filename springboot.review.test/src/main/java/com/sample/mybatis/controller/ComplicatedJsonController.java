package com.sample.mybatis.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.sample.mybatis.common.ResponseResult;
import com.sample.mybatis.model.SellDetail;

/**
 * Ajax Post提交提交非常复杂JSON对象
 * 
 * @author sunchangtan
 *
 */
@Controller
@RequestMapping("/json")
public class ComplicatedJsonController {
	@RequestMapping("index")
	public ModelAndView index(ModelAndView mv) {
		mv.setViewName("/json/index");
		return mv;
	}

	@RequestMapping("submit01")
	@ResponseBody
	public ResponseResult submit01(SellDetail sellDetail) {
		System.out.println(sellDetail.toString());
		return ResponseResult.builder().code(ResponseResult.SUCCESS).build();
	}

	@InitBinder
	protected void initBinder(WebDataBinder binder) {
		binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"), true));
	}
}
