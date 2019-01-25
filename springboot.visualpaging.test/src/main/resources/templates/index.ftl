<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>可视化分页表格</title>
		<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.js"></script>
		<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.js"></script>
		<script src="/static/assets/jquery/plugins/vptable/vptable.js"></script>
		<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" />  
		<link rel="stylesheet" href="/static/assets/jquery/plugins/vptable/vptable.css" />  
	</head>
	<body>
		<div>
			<table id="myTable" />
		</div>
		
		<script type="text/javascript">
			$(function() {
				var oTable = $('#myTable').visualPagingTable({
					columns: [
						{
		                	checkbox: true
			            }, {
			                field: 'userName',
			                title: '姓名'
			            }, {
			                field: 'phone',
			                title: '手机号'
			            }, {
			                field: 'email',
			                title: '邮箱'
			            }, {
			                field: 'sex',
			                title: '性别'
			            }, {
			                field: 'age',
			                title: '年龄'
			            }, {
			                field: 'birthday',
			                title: '出生日期'
			            }, {
			                field: 'stature',
			                title: '身高'
			            }, {
			                field: 'remark',
			                title: '备注'
			            }, {
			                title: '操作',
			                render: function(value, row, index) {
			                	return value;
			                }
			            }
			       ]
				});
				
				oTable.ajax('/userList', {});
			});
		</script>
	</body>
</html>
