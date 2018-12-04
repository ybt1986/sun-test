/**
 * 声明Cmp扩展模块的位置
 */
Cmp.config([{
	//模块标识: 只需要定义一级模块的名字就行了。
	module : 'Cmp',
	//模块资源位置，注意：路径是相对这个脚本的。
	baseUrl : '../../cmps/ext/src',
	//CSS资源的位置，因为不是一个目录的，所以要另行配置
	baseCssUrl : '../../cmps/css/src'
},{
	module : 'Exp',
	baseUrl : '../src'
}]);
Cmp.require([
		'Exp.WidgetViewer',
		'Cmp.util.ArrayTableModel'
	],
	function(viewClazz, modleClazz){
//		putLog('modleClazz:'+modleClazz);
		var dataModel = new modleClazz({
			keies : ['code','name','type','corp','lng','lat','disabledFlag'],
			idIndex : 0,
			values : [
				['1086','成都郫县分拣中心','DISTRIBUTION','4','103.91291809','30.79135895','0'],
				['120191','廊坊固安分拣中心','DISTRIBUTION','6','116.80728149','39.95129013','0'],
				['121671','无锡中转场','DISTRIBUTION','3','120.45217896','31.49882507','0'],
				['121673','宁波中转场','DISTRIBUTION','3','121.51439667','29.94430351','0'],
				['121674','上海浦东分拨中心','DISTRIBUTION','3','121.74957275','31.18470764','0'],
				['125230','上海松江分拨中心','DISTRIBUTION','3','121.25576782','31.08936691','0'],
				['126948','南通配送中心','DISTRIBUTION','3','120.98800659','31.89841080','0'],
				['127081','天津京滨分拨中心','DISTRIBUTION','6','116.81796265','39.56237030','0'],
				['127992','固安配送中心','DISTRIBUTION','6','116.29989624','39.43646622','0'],
				['127997','潍坊配送中心','DISTRIBUTION','6','119.05737305','36.71634674','0'],
				['131512','长春分拨中心','DISTRIBUTION','611','125.25385284','43.82136154','0'],
				['139523','宿迁分拨中心','DISTRIBUTION','3','118.26435089','33.86834335','0'],
				['143483','贵阳分拨中心','DISTRIBUTION','4','106.62286377','26.60136223','0'],
				['144001','汕头配送中心','DISTRIBUTION','10','116.77221680','23.24438286','0'],
				['146054','揭阳分拨中心','DISTRIBUTION','10','116.15088654','23.65211105','0'],
				['150232','烟台中转场','DISTRIBUTION','4','121.41622925','37.42855072','0'],
				['151678','苏州外单分拣中心','DISTRIBUTION','3','121.07218170','31.30721855','0'],
				['1534','天津分拨中心','DISTRIBUTION','4','117.15985107','39.20254135','0'],
				['155891','邯郸中转场','DISTRIBUTION','4','114.57475281','36.67664337','0']
			]
		});
		var TYPE_MAPPING = {
			'DISTRIBUTION' : '分拣中心',
			'SITE' : '站点'
		},
		CORP_MAPPING = {
			'6' : '北京总公司',
			'3' : '上海分公司',
			'4' : '成都分公司',
			'10' : '广州分公司',
			'611' : '沈阳分公司',
		};
		var view = new viewClazz({
			module : 'Cmp.grid.GridPanel',
			initConfig : {
				data : dataModel,
				//等于true时采用斑马条纹形式，设定每行的底色，默认为false。
				striped : true,
				columns : [
					{dataIndex:'name', text:'名称', sortable:true,width:'6rem'},
					{dataIndex:'type', text:'类型', render : function(v){
						return TYPE_MAPPING[v] || v;
					}},
					{dataIndex:'code', text:'编码', sortable:true,width:'3rem'},
					{dataIndex:'corp', text:'归属分公司', sortable:true, width:'5rem', align:'center', render : function(v){
						return CORP_MAPPING[v] || v;
					}},
					{dataIndex:'lng', text:'经度值', sortable:true,width:'5rem'},
					{dataIndex:'lat', text:'纬度值', sortable:true,width:'5rem'},
					{dataIndex:'disabledFlag', text:'有效/失效', align:'center', render : function(v){
						return '1' == v ? '失效':'有效'
					}},
					{text:'操作', render : function(v, r){
						return '';
					}}
				]
			}
		});
		view.render(Cmp.getBody());
	}
);