(function() {
	var HTML = [];
	HTML.push('<div></div>');
	HTML = HTML.join('');

	Cmp.define('Cp.order.Simple', {
		extend : 'Cmp.Widget',
		requires : [ 'Cmp.form.TextField' ],
		cls : true,
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
					
					debugger
					me.textField.dom;
				}
			})
		}
	});
})();