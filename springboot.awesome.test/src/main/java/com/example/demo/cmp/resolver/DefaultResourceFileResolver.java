package com.example.demo.cmp.resolver;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;
import org.springframework.util.ResourceUtils;

public class DefaultResourceFileResolver implements ResourceResolver {
	@Override
	public File getFile(String resourceLocation) throws IOException {
		Assert.notNull(resourceLocation, "Resource location must not be null");
		if (resourceLocation.startsWith(ResourceUtils.CLASSPATH_URL_PREFIX)) {
			String path = resourceLocation.substring(ResourceUtils.CLASSPATH_URL_PREFIX.length());
			String description = "class path resource [" + path + "]";
			ClassLoader cl = ClassUtils.getDefaultClassLoader();
			URL url = (cl != null ? cl.getResource(path) : ClassLoader.getSystemResource(path));
			if (url == null) {
				if(path.contains(".min.")) {
					path = path.replace(".min.", ".");
				}
				description = "class path resource [" + path + "]";
				url = (cl != null ? cl.getResource(path) : ClassLoader.getSystemResource(path));
			}
			
			if(url == null) {
				throw new FileNotFoundException(description +
						" cannot be resolved to absolute file path because it does not exist");
			}
			return getFile(url, description);
		}
		try {
			// try URL
			return getFile(new URL(resourceLocation));
		}
		catch (MalformedURLException ex) {
			// no URL -> treat as file path
			return new File(resourceLocation);
		}
	}
	
	public File getFile(URL resourceUrl) throws FileNotFoundException {
		return getFile(resourceUrl, "URL");
	}

	public File getFile(URL resourceUrl, String description) throws FileNotFoundException {
		Assert.notNull(resourceUrl, "Resource URL must not be null");
		if (!ResourceUtils.URL_PROTOCOL_FILE.equals(resourceUrl.getProtocol())) {
			throw new FileNotFoundException(
					description + " cannot be resolved to absolute file path " +
					"because it does not reside in the file system: " + resourceUrl);
		}
		try {
			return new File(toURI(resourceUrl).getSchemeSpecificPart());
		}
		catch (URISyntaxException ex) {
			// Fallback for URLs that are not valid URIs (should hardly ever happen).
			return new File(resourceUrl.getFile());
		}
	}
	
	public URI toURI(URL url) throws URISyntaxException {
		return toURI(url.toString());
	}
	
	public URI toURI(String location) throws URISyntaxException {
		return new URI(StringUtils.replace(location, " ", "%20"));
	}
}
