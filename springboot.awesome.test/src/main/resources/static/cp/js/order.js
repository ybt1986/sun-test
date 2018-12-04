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
            '../../../../../public/echart-3.2.3/dist/echarts.min.js'
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
            'Cp.order.MainView'
        ],
        function(ViewClz) {
            var view = new ViewClz();
            view.render(Cmp.getBody());
        });
}());
