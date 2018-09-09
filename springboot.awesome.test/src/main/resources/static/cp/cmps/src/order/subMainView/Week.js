var HTML = [];
HTML.push('<div class="cp-main-row"></div>');
HTML = HTML.join();

var biuldActiveCell = function(r){
	var me = this,
		cid = me.getId(),
		html = r.get('status');
	html = html+'';
	//检测是否可以下载或查看
	if('0' === html || '1' === html){
		return '未完成运算,不能操作';
	}	
	else if('3' === html){
		return '运算异常,不能操作';
	}
	html = [];	
	html.push('<a class="btn fa fa-eye" title="查看优化情况" onclick="Cmp.invockCmpFunction(\'');
	html.push(cid);
	html.push('\',\'showSchemaDetail\',');
	html.push(r.get('key'));
	html.push(')">查看</a>');
    //删除
    html.push('&nbsp&nbsp<a class="btn fa fa-trash" title="删除" onclick="Cmp.invockCmpFunction(\'');
    html.push(cid);
    html.push('\',\'deleteSchema\',');
    html.push(r.get('key'));
    html.push(')">删除</a>');
	return html.join('');
};

var STATUS_MAP = {
		'0' : '准备运算',
		'1' : '正在运算',
		'2' : '完成运算',
		'3' : '运算异常'
	};

Cmp.define('Cp.order.subMainView.Week', {
    extend: 'Cmp.Widget',
    requires: [
        'Cmp.grid.GridPanel',
        'Cmp.util.AjaxProxy',
		'Cmp.util.ArrayTableModel',
		'Cmp.Button'
    ],
    cls: true,
    factory:function(ext,reqs){
        var SP = ext.prototype,
        GridPanel = reqs[0],
        AjaxProxy = reqs[1],
        ArrayTableModel = reqs[2]
        Button = reqs[3];
        return Cmp.extend(ext, {
            initComponent: function() {
                var me = this,
                    cls = me.cls;
                if (isA(cls)) {
                    cls.unshift('cp-order');
                } else if (isS(cls)) {
                    cls = ['cp-order', cls];
                } else {
                    cls = 'cp-order';
                }
                me.cls = cls;
                
              //数据模型
//				me.data = new TableModel({
//					keies : me.fields
//				});
				
                SP.initComponent.call(me);
            },
            doRender:function () {
                var me = this;
                SP.doRender.call(me);
                me.el.update(HTML);
                
                me.init();
            },
            init: function() {
            	var me = this;
            	dom = me.el.dom.firstChild;
            	
            	 me.gridData = new ArrayTableModel({
                     keies : [
                       'sourceId','sourceName',
                       'targetId','targetName',
                       'itemFirstCateCd','itemSecondCateCd',
                       'itemThirdCateCd','cateName',
                       'storeCateVolume', 'storeCateQtty'
                     ]
                   });
            	 
				me.gridBox = Cmp.get(dom);
				
				me.gridData.on('changed', me.onGridDataChanged, me);
				
				 me.ruleGrid = new GridPanel({
			            data : me.gridData,
			            columns : [
			              {dataIndex:'sourceName', text:'源库房',width:'6rem',style:{'textAlign':'center'},render : function(v, r){
			                var html = [];
			                html.push('<div class="ipview-grid-houseName" ');
			                html.push('title="' + v + '"');
			                html.push('>');
			                html.push(v);
			                html.push('</div>');
			                var final = html.join('');
			                return final;
			              }},
			              {dataIndex:'targetName', text:'目标库房',width:'6rem',style:{'textAlign':'center'},render : function(v, r){
			                var html = [];
			                html.push('<div class="ipview-grid-houseName" ');
			                html.push('title="' + v + '"');
			                html.push('>');
			                html.push(v);
			                html.push('</div>');
			                var final = html.join('');
			                return final;
			              }},
			              {dataIndex:'cateName', text:'品类',width:'5rem',style:{'textAlign':'center'}},
			              {dataIndex:'storeCateQtty', text:'库存量',width:'4rem',style:{'textAlign':'center'}},
			              {text:'操作',width:'2.4rem',style:{'textAlign':'center'}, render : function(v, r){
			                var html = [];
			                html.push('<a class="fa fa-times" ');
			                html.push('onclick="Cmp.invockCmpFunction(\'');
			                html.push(me.getId());
			                html.push('\',\'doDelteRuleGridRow\',');
			                html.push('\'' + r.get('sourceId') + '\'');
			                html.push(',');
			                html.push('\'' + r.get('targetId') + '\'');
			                html.push(',');
			                html.push(r.get('itemFirstCateCd'));
			                html.push(',');
			                html.push(r.get('itemSecondCateCd'));
			                html.push(',');
			                html.push(r.get('itemThirdCateCd'));
			                html.push(')">删除</a>');
			                var final = html.join('');
			                return final;
			              }}
			            ]
			          });
			          me.ruleGrid.render(me.gridBox);
			          me.gridBox.setHideModal('display');
				
//				me.button = new Button({
//					text: 'aaaa'
//				});
//				me.button.render(me.gridBox);
            },
            
            onGridDataChanged: function() {
            	
            }
        })
    }
});