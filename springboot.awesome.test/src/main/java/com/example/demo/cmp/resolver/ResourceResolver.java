package com.example.demo.cmp.resolver;

import java.io.File;
import java.io.IOException;

public interface ResourceResolver {

	File getFile(String resourceLocation) throws IOException;
	
	boolean exist(String resourceLocation);

}
