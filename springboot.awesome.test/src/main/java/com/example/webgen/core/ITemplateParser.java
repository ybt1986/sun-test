package com.example.webgen.core;

import java.io.File;
import java.io.Writer;
import java.util.Map;

public interface ITemplateParser {
	public void parse(String templateFileName, Map<String, Object> params, Writer outWriter);

	public void parse(String templateFileName, Map<String, Object> params, File file);
}
