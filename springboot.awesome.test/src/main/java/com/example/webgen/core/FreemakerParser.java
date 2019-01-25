package com.example.webgen.core;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;

import freemarker.template.Template;
import freemarker.template.TemplateException;

public class FreemakerParser implements ITemplateParser {

	@Override
	public void parse(String templateFileName, Map<String, Object> params, Writer outWriter) {
		Template template = FreeMarkerTemplateUtils.getTemplate(templateFileName);
		try {
			template.process(params, outWriter);
		} catch (TemplateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void parse(String templateFileName, Map<String, Object> params, File file) {
		FileOutputStream fos;
		try {
			fos = new FileOutputStream(file);
			Writer outWriter = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8"), 10240);

			this.parse(templateFileName, params, outWriter);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
