package com.sample.suncht.controller;

import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.sample.suncht.service.MessageProductor;

@Controller
public class IndexController {

	@Autowired
	private MessageProductor messageProductor;

	@RequestMapping("/")
	public ModelAndView demo1(ModelAndView mv) {
		mv.setViewName("index2");
		Thread t = new Thread(new Runnable() {

			@Override
			public void run() {
				while (true) {
					messageProductor.templateTest(UUID.randomUUID().toString());
					try {
						Thread.sleep(new Random().nextInt(1000));
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		});
		t.start();
		return mv;
	}

	@RequestMapping("/push")
	@ResponseBody
	public String push() {
		Thread t = new Thread(new Runnable() {

			@Override
			public void run() {
				while (true) {
					messageProductor.templateTest(UUID.randomUUID().toString());
					try {
						Thread.sleep(new Random().nextInt(1000));
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		});
		t.start();
		return "开始推送数据...";
	}
}
