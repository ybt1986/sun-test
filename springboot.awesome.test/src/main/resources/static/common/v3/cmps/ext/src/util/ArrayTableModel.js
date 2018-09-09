/**
 * 使用二维数组形式读取传入数据的TableModel实现。
 * <p>
 *
 * @class Cmp.util.ArrayTableModel
 * @extend Cmp.util.TableModel
 *
 * @version 1.0.0
 * @since 2015-10-31
 * @author Jinhai
 */
(function(){

	Cmp.define('Cmp.util.ArrayTableModel',{
		extend : 'Cmp.util.TableModel',
		requires : [
			'Cmp.util.Record'
		],
		factory : function(ext, reqs){
			var superClass = ext.prototype,
				RecordClass = reqs[0];
			return Cmp.extend(ext, {
				/**
				 * @private
				 * @overwrite
				 * 创建一条数据的工厂方法，此处传入是一个数组。
				 *
				 * @param {Array} value
				 * @return {Record} record对象实例。
				 */
				createRecord : function(value){
					var me = this;
					if(isA(value)){
						var ks = me.keies,
							i = value.length,
							len = ks.length,
							o = {};
						 
						 len = i < len ? i : len;
						 for(i=0;i<len;i++){
						 	o[ks[i]] = value[i];
						 }
						 
						 return new RecordClass({
							allowKeies : ks,
							value : o
						});
					}
					return false;
				}
			});
		}
	});
}());