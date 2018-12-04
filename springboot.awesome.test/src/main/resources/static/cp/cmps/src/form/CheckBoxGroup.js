(function(){
    Cmp.define('Cp.form.CheckBoxGroup',{
        extend : 'Cmp.Widget',
        cls : true,
        requires : [
            'Cp.form.CheckBox'
        ],
        factory : function(ext, reqs){
            var superClazz = ext.prototype,
                CheckBox = reqs[0];
            return Cmp.extend(ext, {
                initComponent : function(){
                    var me = this,
                        cls = me.cls;
                    if (isA(cls)) {
                        cls.unshift('lsc-checkboxGroup');
                    } else if (isS(cls)) {
                        cls = ['lsc-checkboxGroup', cls];
                    } else {
                        cls = 'lsc-checkboxGroup';
                    }
                    me.cls = cls;
                    superClazz.initComponent.call(me);
                    me.addEvents('changed');
                },
                doRender:function(){
                    var me = this,
                        el, lw, allW;
                    superClazz.doRender.call(me);
                    el = me.el;
                    lw = me.labelWidth;
                    el.setHideModal('display');
                    if(isN(lw)){
                        lw += 'px';
                    }
                    if(!isS(lw)) {
                        lw = '5rem';
                    }
                    me.labelWidth = lw ;
                    // labelBox
                    me.labelBox = el.createChild({
                        cls:'c-lb',
                        style:{
                            width:lw
                        },
                        html: '<span class="crude">' + (me.labelText || '') + '</span><i></i><b></b>'
                    });
                    me.labelBox.setHideModal('display');
                    allW = me.allInputWidth;
                    if(isN(allW)){
                        allW += 'px';
                    }
                    if(!isS(allW)) {
                        allW = '5rem';
                    }
                    me.allInputWidth = allW ;
                    // checkboxWarp
                    me.checkboxWarp = el.createChild({
                        cls:'checkbox-warp',
                        style:{
                            paddingLeft : lw
                        }
                    });

                    // 全选按钮  默认宽度为5rem
                    me.allInputBox = me.checkboxWarp.createChild({
                        cls:'allInput-box',
                        style:{
                            width:allW
                        }
                    });
                    me.allInput = new CheckBox({
                        hideLabel : true,
                        text : isS(me.allText) ? me.allText : ''
                    });
                    me.allInput.render(me.allInputBox);
                    me.allInputBox.setHideModal('display');
                    me.allInput.on('changed',me.toAllChanged,me);
                    // 多选按钮父盒子
                    me.checkboxBar = me.checkboxWarp.createChild({
                        cls:'checkbox-bar'
                    });

                    // 初始化是否隐藏标签
                    if (typeof me.hideLabel !== 'undefined' && isB(me.hideLabel) && me.hideLabel) {
                        me.hideLabelBox();
                    }
                    // 初始化是否隐藏全选按钮
                    if (typeof me.hideAllInput !== 'undefined' && isB(me.hideAllInput) && me.hideAllInput) {
                        me.hideAllInputBox();
                    }
                    me.checkboxArr = [];  // 最外层的数组
                    if(isA(me.options)){
                        me.renderOptions();
                    }
                },
                renderOptions: function() {
                    var me = this;
                    me.resetOptionBox();
                    me.renderCheckboxs();
                },
                resetOptionBox: function() {
                    var me = this;
                    me.checkboxArr = [];
                    me.checkboxNames = [];
                    me.checkboxBar.update('');
                },
                // 渲染多选按钮
                renderCheckboxs:function(){
                    var me = this,i,len,status,temp;
                    if(!isA(me.options) || me.options.length === 0){
                        return ;
                    }
                    for(i=0,len = me.options.length;i<len;i++){
                        temp = new CheckBox(me.options[i]);
                        temp.hideLabel = true;
                        temp.render(me.checkboxBar.dom);
                        temp.on('changed',(function(index){
                            return function(data){
                                me.onSubChanged(index,data);
                            };
                        }(i)));
                        me.checkboxArr.push(temp);
                        me.checkboxNames.push(temp.key);
                    }
                    if (isA(me.checkboxArr) && me.checkboxArr.length > 0 && isB(me.needDefault) && me.needDefault) {
                        me.checkboxArr[0].toCheckedMode();
                    }
                },
                onSubChanged:function (index) {
                    var me = this,arr = [];
                    Cmp.each(me.checkboxArr,function(item){
                        if(item.isCheckeded()){
                            arr.push(item.getValue());
                        }
                    });
                    var len = arr.length,
                        checkboxLen = me.checkboxArr.length;
                    if(len === 0){
                        me.allInput.toUncheckedMode();
                    }
                    if(len > 0 && len<checkboxLen){
                        me.allInput.toHalfCheckedMode();
                    }
                    if(len === checkboxLen){
                        me.allInput.toCheckedMode();
                    }
                    me.fireEvent('changed', index , me);
                },
                cancelSelect:function (index) {
                    var me = this;
                    me.checkboxArr[index].toUncheckedMode(true);
                },
                toAllChanged:function (checkModue) {
                    var me = this,status;
                    status = checkModue;
                    if(status === 'checked'){
                        Cmp.each(me.checkboxArr,function(item){
                            item.toCheckedMode(true);
                        });
                    }else if(status !== 'half'){
                        Cmp.each(me.checkboxArr,function(item){
                            item.toUncheckedMode(true);
                        });
                    }
                    me.fireEvent('changed');
                },
                /**
                 * 隐藏左侧的标题性文字
                 * */
                hideLabelBox:function(){
                    var me = this;
                    me.labelBox.hide();
                    me.checkboxWarp.setStyle({
                        paddingLeft:'0rem'
                    });
                },
                /**
                 * 隐藏全选按钮
                 * */
                hideAllInputBox:function(){
                    var me = this;
                    me.allInputBox.hide();
                    me.checkboxBar.setStyle({
                        paddingLeft:'0rem'
                    });
                },
                setOptions: function(options) {
                    var me = this;
                    if (!isA(options)) {
                        return;
                    }
                    me.options = options;
                    me.renderOptions();
                },
              /**
               *
               * @param {Array} data ['keya','keyc']
               */
                setValue : function (data) {
                    var me = this;
                    Cmp.each(me.checkboxArr,function(item){
                        item.toUncheckedMode();
                    })
                    Cmp.each(data,function (item) {
                        var index = me.checkboxNames.indexOf(item);
                        me.checkboxArr[index].toCheckedMode();
                    })
                },
                getValue: function() {
                    var me = this;
                    me.value = [];
                    Cmp.each(me.checkboxArr,function(item){
                        if(item.isCheckeded()){
                            me.value.push({
                              text :item.getText(),
                              value:item.getValue(),
                              key :item.getName()
                            });
                        }
                    });
                    return me.value;
                }
            });
        }
    });
}());