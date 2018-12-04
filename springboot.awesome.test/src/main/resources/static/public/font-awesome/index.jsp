<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apache.commons.io.IOUtils"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.TreeMap"%>
<% 
	List<Map<String, String>> icons = new LinkedList();
	try{
		ServletContext context = session.getServletContext();
		InputStream input = context.getResourceAsStream("/public/font-awesome/font-awesome.min.css");
		List<String> lines = IOUtils.readLines(input);
		String line = null;
		String tmp = null;
		String name = null;
		boolean in = false;
		int ix = -1;
		for(Iterator<String> i = lines.iterator(); i.hasNext(); ){
			line = i.next();
			tmp = line.toLowerCase();
			if(in){
				tmp = tmp.trim();
				if("}".equals(tmp)){
					in = false;
				}
				else if(tmp.startsWith("content")){
					ix = tmp.indexOf(":");
					if(ix > -1){
						tmp = tmp.substring(ix+1).trim();
						if(tmp.endsWith(";")){
							tmp = tmp.substring(0, tmp.length()-1);
						}
						tmp = tmp.substring(1, tmp.length()-1);
						Map<String,String> map = new TreeMap();
						map.put("name", name);
						map.put("content", tmp);
						icons.add(map);
					}
				}
			}
			else{
				ix = tmp.indexOf(":before");
				if(ix > -1 && tmp.startsWith(".")){
					name = tmp.substring(1, ix);
					in = true;
				}
			}
		}
	}
	catch(Exception e){
		e.printStackTrace();
	}
%>	
<!DOCTYPE>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="./font-awesome.min.css">
		
		<style type="">
			@media (min-width:1024px){
				html{
					font-size:20px;
				}
			}
			@media (min-width:1280px){
				html{
					font-size:25px;
				}
			}
			@media (min-width:1600px){
				html{
					font-size:30px;
				}
			}
			body{
				background-color: #FEFEFE;
			}
			.icon-list{
				width: 50rem;
				position: relative;
				margin-left: auto;
				margin-right: auto;
				padding : 0.5rem;
				border: 1px solid #CCC;
			}
			.icon-list:before{
				content: " ";
				display: table;
			}
			.icon-list:after{
				content: " ";
				display: table;
				clear: both;
			}
			.icon-view{
				position: relative;
				float: left;
				width: 7rem;
				height: 2rem;
				margin: 0.2rem;
				color: #444;
				background-color: #FFF;
				border: 1px solid #CCC;
			}
			.icon-exp{
				font-size : 1rem;
				text-align: center;
				width : 2rem;
				height: 2rem;
				line-height: 2rem;
				float : left;
			}
			.icon-right{
				float : left;
				height: 2rem;
				width : 5rem;
			}
			.icon-name,
			.icon-value{
				position: relative;
				height: 1rem;
				line-height: 1rem;
				width : 100%;
				text-align: center;
				font-size : 0.5rem; 
			}
		</style>
		<title>支持图标列表</title>
	</head>
	<body>
		<div class="icon-list">
<% 
	Map<String, String> icon = null;
	String name = null;
	String content = null;
	for(Iterator<Map<String, String>> i = icons.iterator(); i.hasNext(); ){
		icon = i.next();
		name = icon.get("name");
		content = icon.get("content");
		
		%>
			<div class="icon-view">
				<div class="icon-exp fa <%=name%>"></div>
				<div class="icon-right">
					<div class="icon-name"><%=name%></div>
					<div class="icon-value"><%=content%></div>
				</div>
			</div>
		<%
		
	}	

%>	
	</div>
	</body>
</html>