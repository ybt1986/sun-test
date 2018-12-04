(function() {
  var HTML = [];
  HTML.push('<div class="lp-card-title">关键指标</div>')
  HTML = HTML.join('');
  Cmp.define('Cp.card.IconCardGroup', {
    extend: 'Cmp.Widget',
    requires: [
      'Cp.card.IconCard'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        Card = reqs[0];
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          superClazz.initComponent.call(me);
          me.addEvents('onClick');
        },
        doRender: function() {
          var me = this,
            len, width, box;
          superClazz.doRender.call(me);
          me.el.addClass('lp-cardgroup');
          me.el.update(HTML);
          me.cardBox = Cmp.get(me.el.dom[1]);
          me.cards = [];
          len = me.list.length;
          if (!isN(me.rowLimit)) {
            width = 100 / len;
            box = me.cardBox.createChild({
              tag: 'div',
              cls: 'lp-cardgroup-row'
            });
          } else {
            width = 100 / me.rowLimit;
          }
          Cmp.each(me.list, function(item, index) {
            var temp;
            if (isN(me.rowLimit) && index % me.rowLimit === 0) {
              box = me.el.createChild({
                tag: 'div',
                cls: 'lp-cardgroup-row'
              });
            }
            Cmp.apply(item.cfg, {
              disabled: me.disabled
            });
            temp = me.createCard(box, item, width + '%', index);
            if (index === 0) {
              me.nowCard = temp.item;
            }
            me.cards.push(temp);
          });
          me.footTitle = me.el.createChild({
            tag: 'div',
            cls: 'lp-cardgroup-footer'
          });
          me.footTitle.update('系统给出建议：根据库存健康指数得分，由于'+me.cardName+'错过'+me.num+' %,请关注指标相关库存......')
        },
        /**
         * 生成一个card
         * @param  {Object} item
         */
        createCard: function(box, item, width, index) {
          var me = this,
            cardBox, card;
          cardBox = box.createChild({
            tag: 'div',
            cls: 'lp-cardgroup-item'
          });
          cardBox.setWidth(width);
          card = new Card(item.cfg);
          card.render(cardBox);
          if (index === 0) {
            card.check();
          }
          card.on('onClick', (function(name) {
            return function() {
              me.onCardClick(name);
            }
          })(item.dataName), me);
          return {
            dataName: item.dataName,
            item: card
          }
        },
        /**
         * 设置数据
         * @param  {Array} data
         */
        setValue: function(data) {
          var me = this;
          Cmp.each(me.cards, function(item) {
            var name = item.dataName,
              el = item.item;
            if (Cmp.isDefined(data[name])) {
              el.setValue(data[name]);
            }
          })
        },
        /**
         * card点击处理
         */
        onCardClick: function(dataName) {
          var me = this;
          if (isO(me.nowCard)) {
            me.nowCard.uncheck();
          }
          Cmp.each(me.cards, function(item) {
            if (item.dataName === dataName) {
              me.nowCard = item.item;
              return false;
            }
          });
          me.fireEvent('onClick', dataName);
        },
        /*
          设置默认值
        */
        setDefaultCard:function(index){
            var me = this;
            me.cards[index].item.check();
            me.nowCard = me.cards[index].item;
        },
        setFootText : function (cardName , num) {
          var me = this;
          me.cardName = cardName;
          me.num = num;
          me.footTitle.update('系统给出建议：根据库存健康指数得分，由于'+me.cardName+'错过'+me.num+' %,请关注指标相关库存......')

        }
      })
    }
  })
}());
