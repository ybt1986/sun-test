package com.sample.suncht.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.sample.suncht.service.ArithmeticService;
import com.sample.suncht.service.BeanManageService;
import com.sample.suncht.service.TestService;
import com.sample.suncht.util.SpringContextUtil;

@Controller
public class IndexController {
	@Resource
	private BeanManageService beanManagerService;

	@RequestMapping("/")
	public ModelAndView demo1(ModelAndView mv) {
		mv.setViewName("index");
		return mv;
	}

	@RequestMapping("/test/{beanName}")
	@ResponseBody
	public String testService(@PathVariable("beanName") String beanName) {
		TestService testService = (TestService) SpringContextUtil.getBean(beanName);
		if (testService != null) {
			return testService.test();
		}

		return "NO";
	}

	@RequestMapping("/arithmetic/{beanName}")
	@ResponseBody
	public String arithmetic(@PathVariable("beanName") String beanName) {
		ArithmeticService service = (ArithmeticService) SpringContextUtil.getBean(beanName);

		String message = "";
		if (service != null) {
			int status = service.status();
			if (status == 0) {
				service.process();
				message = "提交算法，开始计算...";
			} else if (status == 1) {
				message = "正在计算中，进度为" + service.progress() + "/100, 请稍候...";
			} else if (status == 10) {
				message = "计算结果为：" + service.result();
			} else if (status == 11) {
				message = "计算失败，原因如下：" + service.result();
			}

			return message;
		}

		return "找不到算法服务[" + beanName + "]";
	}

	@RequestMapping("/arithmetic/reset")
	@ResponseBody
	public String resetArithmetic(@PathVariable("beanName") String beanName) {
		ArithmeticService service = (ArithmeticService) SpringContextUtil.getBean(beanName);

		if (service != null) {
			service.reset();
		}

		return "找不到算法服务[" + beanName + "]";
	}
}
