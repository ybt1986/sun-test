package com.example.demo.cmp.resolver;

import java.io.IOException;
import java.io.InputStream;

public interface ResourceResolver {

	InputStream getFile(String resourceLocation) throws IOException;
	
	boolean exist(String resourceLocation);

}
