var HTML = [];
HTML.push('<div></div>');
HTML = HTML.join('');

Cmp.define('Cp.order.MainView', {
    extend: 'Cmp.Widget',
    requires: [
        'Cp.panel.TabPanel',
        'Cp.order.subMainView.Day',
        'Cp.order.subMainView.Week',
        'Cp.order.subMainView.Month'
    ],
    cls: true,
    factory:function(ext,reqs){
        var SP = ext.prototype,
            TabPanel = reqs[0],
            Day = reqs[1],
            Week = reqs[2],
            Month = reqs[3];
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
                me.day = new Day;
                me.week = new Week;
                me.month = new Month;
                me.regionTabPanel = new TabPanel({
                    list: [
                        {
                            name: '日',
                            item: me.day,
                            dataName: 'day'
                        },
                        {
                            name: '周',
                            item: me.week,
                            dataName: 'week'
                        },
                        {
                            name: '月',
                            item: me.month,
                            dataName: 'month'
                        }
                    ]
                });
                me.regionTabPanel.render(me.el);
            }
        })
    }
});