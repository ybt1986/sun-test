var  HTML = [];
HTML.push('<div class="cp-main-row cp-col-3"></div>');
HTML.push('<div class="cp-main-row"></div>');
HTML.push('<div class="cp-main-row"></div>');
HTML = HTML.join('');

Cmp.define('Cp.order.subMainView.Month', {
    extend: 'Cmp.Widget',
    requires: [
        'Cmp.form.TextField',
        'Cmp.Button'
    ],
    cls: true,
    factory:function(ext,reqs){
        var SP = ext.prototype,
            TextField = reqs[0],
            Button = reqs[1];
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

                me.textFieldContainer = me.el.dom.childNodes[0];
                me.textField = new TextField({
                    label: '用户名',
                    value: '',
                    emptyText: '输入用户名'
                });
                me.textField.render(me.textFieldContainer);
               
            }
        })
    }
});