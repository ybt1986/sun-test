package com.example.webgen.core;

import java.io.File;
import java.util.Map;

import com.google.common.collect.Maps;

public class VmBuilder {
	private WebGenConfigure configure;
	private String vmName;
	private String title;
	private String mainJs;

	private ITemplateParser templateParser = new FreemakerParser();

	public void build() {
		Map<String, Object> params = Maps.newHashMap();
		params.put("cmp-core.js", configure.getCmpCoreJs());
		params.put("main.js", mainJs);
		params.put("title", title);
		templateParser.parse("vm.tpl", params, new File(""));
	}

	public WebGenConfigure getConfigure() {
		return configure;
	}

	public void setConfigure(WebGenConfigure configure) {
		this.configure = configure;
	}

	public String getVmName() {
		return vmName;
	}

	public void setVmName(String vmName) {
		this.vmName = vmName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
