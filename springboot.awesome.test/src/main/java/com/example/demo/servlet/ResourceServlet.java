package com.example.demo.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.resource.ResourceUrlEncodingFilter;

import com.example.demo.cmp.ResourceConfig;
import com.example.demo.cmp.reader.FileContentReader;

public class ResourceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private ResourceConfig resourceConfig;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String requestUrl = req.getRequestURI();
		if(StringUtils.isNotBlank(resourceConfig.getContextPath())) {
			requestUrl = requestUrl.substring(resourceConfig.getContextPath().length());
		}
		requestUrl = requestUrl.substring(requestUrl.indexOf("/", 1));

		String result = "";
		if (StringUtils.isNotBlank(requestUrl)) {
			result = new FileContentReader(resourceConfig, requestUrl).read();
		}
		resp.getWriter().print(result);
	}

	@Override
	public void init() throws ServletException {
		super.init();
		ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
		resourceConfig = ctx.getBean(ResourceConfig.class);
	}
}
