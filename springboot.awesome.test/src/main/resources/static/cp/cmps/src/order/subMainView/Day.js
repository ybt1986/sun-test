var  HTML = [];
HTML.push('<div class="cp-main-row cp-col-3"></div>');
HTML.push('<div class="cp-main-row"></div>');
HTML.push('<div class="cp-main-row"></div>');
HTML = HTML.join('');
Cmp.define('Cp.order.subMainView.Day', {
    extend: 'Cmp.Widget',
    requires: [
        'Cmp.form.DateField'
    ],
    cls: true,
    factory:function(ext,reqs){
        var SP = ext.prototype,
            DateField = reqs[0];
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
                SP.initComponent.call(me);
            },
            doRender:function () {
                var me = this,doms;
                SP.doRender.call(me);
                me.el.update(HTML);
                me.renderTop();
                me.renderCenter();
                me.renderBottom();
            },
            renderTop:function () {
                var me = this;
                me.dateChoose = me.el.dom.childNodes[0];
                me.dateRange = new DateField({
                    label: '统计日期',
                    value: new Date(),
                    maxValue: new Date(),
                    emptyText: '请选择日期...'
                });
                me.dateRange.render(me.dateChoose);
            },
            renderCenter:function () {
                
            },
            renderBottom:function () {
                
            }
        })
    }
});