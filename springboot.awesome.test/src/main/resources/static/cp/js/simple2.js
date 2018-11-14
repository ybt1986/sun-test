/**
 * 收入看板界面的启动脚本
 * @author Weihw
 */
(function() {
    Cmp.config([{
        module: 'Cmp',
        baseUrl: '../../common/v3/cmps/ext/src',
        baseCssUrl: '../../common/v3/cmps/css/src',
        path: [
            // EChart
            //'../../../../../public/echart-3.2.3/dist/echarts.min.js'
            //'../../../../../public/echart-3.2.3/map/js/china.js'
        ]
    }, {
        module: 'Cp',
        baseUrl: '../cmps/src',
        baseCssUrl: '../css/src',
        path: [
            '../../css/src/Base.css',
            '../../../public/font-awesome/font-awesome.min.css'
        ]
    }]);

    Cmp.require(
        [
            'Cp.order.Simple'
        ],
        function(ViewClz) {
            var view = new ViewClz();
            view.render(Cmp.getBody());
    });
}());

(function() {
	var HTML = [];
	HTML.push('<div></div>');
	HTML = HTML.join('');

	Cmp.define('Cp.order.Simple', {
		extend : 'Cmp.Widget',
		requires : [ 'Cmp.form.TextField' ],
		//cls : true,
		factory : function(ext, reqs) {
			var SP = ext.prototype, TextField = reqs[0];
			return Cmp.extend(ext, {
				initComponent : function() {
					var me = this, cls = me.cls;
					if (isA(cls)) {
						cls.unshift('cp-simle');
					} else if (isS(cls)) {
						cls = [ 'cp-simle', cls ];
					} else {
						cls = 'cp-simle';
					}
					me.cls = cls;
					SP.initComponent.call(me);
				},
				doRender : function() {
					var me = this, doms;
					SP.doRender.call(me);
					me.el.update(HTML);
					me.textField = new TextField({
						label : "姓名",
						emptyText : "请输入"
					});
					me.textField.render(me.el);
				}
			})
		}
	});
})();
