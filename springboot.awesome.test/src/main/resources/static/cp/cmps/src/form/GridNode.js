(function() {
  function Node(cfg) {
    this.data = cfg;
  }

  Node.prototype = {
    /**
     * 根据key设置对应值
     * @author Weihw
     * @date   2018-03-01
     * @param  {String}     key 数据key
     * @param  {Anything}   val 数据值
     */
    setValue: function(key, val) {
      if (typeof this.data[key] !== 'undefined') {
        this.data[key] = val;
      }
    },
    /**
     * 获取该节点所有数据
     * @author Weihw
     * @date   2018-03-01
     */
    getValue: function() {
      return this.data;
    },
    /**
     * 根据key获取值
     * @author Weihw
     * @date   2018-03-01
     * @param  {String}    key 数据key
     * @return {Anything}  如果有对应值返回对应值，如果没有返回undefined
     */
    getValueByKey: function(key) {
      return typeof this.data[key] === 'undefined' ? void(0) : this.data[key];
    },
    /**
     * 判断对应key的值是否与node实例值一样
     * @param  {String}   key
     * @param  {Anything} val
     */
    isVal: function(key, val) {
      var me = this;
      if (typeof me.data[key] === 'undefined' || me.data[key] !== val) {
        return false
      } else {
        return true;
      }
    }
  };
  Cmp.define('Cp.form.GridNode', {
    factory: function() {
      return Node;
    }
  })
}());
