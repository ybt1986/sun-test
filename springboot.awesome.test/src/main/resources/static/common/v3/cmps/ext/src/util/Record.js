/**
 * 对于一条数据的结构描述；
 * <p>
 * 类似于Java中java.util.Map类的JavaScript上的封装，并加入了一些JS特性。
 * 
 * @class Cmp.util.Record
 * @extend Cmp.util.Observable
 *
 * @version 1.0.0
 * @since 2015-10-31
 * @author Jinhai
 */
(function(){
	var Record = Cmp.extend(Cmp.util.Observable, {
		/**
		 * @constructor
		 * 
		 * @data {Object} value 初始时设定的数据。
		 * @data {Array} allowKeies 允许设定的键值，
		 *		当不设定该值(等于null，undefined或长度为0的数组)时，表示不对设定的key作限制。
		 *
		 * @param {Object} config 预定义的数据配置，其属性参考@data注释
		 * @param {Mixed} listeners 定义的数据监听方法。
		 */
		constructor : function(config, listeners){
			var me = this,
				//名值对
				data = {},
				//已存在的key
				keies = [],
				//允许设定的key
				allowKeies = false,
				//长度
				length = 0,
				//事务模式标记
				editing = false,
				editBatch;
			
			me.addEvents(
				/**
				 * @event
				 * 当数据发生的时候，触发该事件。
				 * <p>
				 * 不在事务模式下时，调用set，remove这两个方法将有可能触发该事件。
				 * 在事务模式下，调用endEdit,commit这两个方法将有可能触发该事件。
				 *
				 * @param {Record} this
				 */
				'changed'
			);
			//设定监听
			Record.superclass.constructor.call(me, {
				listeners : listeners
			});
			
			/**
			 * 实际执行put操作的方法。该方法只会进行数据操作，不负责事件分发。
			 * @param {String/Object/Record} key 当为一个字符串的时候，会认定这是一个属性名；
			 *									 当为一个Record对象的时候，则认为使用这条数据中的各项值来覆盖当前这条数据；
			 *									 当为一个普通数据对象的时候，则认为使用这个对象为一个key/value形式的名值对，并使用这些值来覆盖当前这条数据。
			 * @param {Object} value 所设定的值，可以使任何一个对象，但当等于undefined的时候，则会认为需要从当前这条数据中移除这项数据(当key等于一个字符串时是这样认为的)。
			 * @return {Boolean} 值发生了改变的时候，返回true。否则返回false.
			 */
			var putByInner = function(key, value){
				var k,v,i,ov,c = false;
				if(isS(key)){
					ov = {};
					ov[key] = value;
					key = ov;
				}
				for(k in key){
					v = key[k];
					ov = data[k];
					if(v !== ov
							&& (!allowKeies || allowKeies.indexOf(k) > -1)){
						i = keies.indexOf(k);
						if(undefined === v){
							delete data[k];
							if(i > -1){
								keies.slice(i, 1);
								length--;
							}
						}
						else{
							data[k] = v;
							if(i < 0){
								keies.push(k);
								length++;
							}
						}
						c = true;
					}
				}
				
				return c;
			}
			/**
			 * 实际执行remove操作。
			 * 
			 * @param {String/Array} key 期望移除的数据项键值或这些键值组成的数组
			 * @return {Object/Array} 所移除的数据项得值；如果key传入的是一个字符串，则返回之前设定的值；如果是一个数组，则返回一个同样长度的数组。
			 *		如果返回undefined则说明当前没有设定这个属性。
			 */
			var removeByInner = function(key){
				var ind,k,ov,c,rel;
				if(isS(key)){
					ov = data[key];
					delete data[key];
					if(undefined === ov){
						return undefined;
					}
					ind = keies.indexOf(key);
					if(ind > -1){
						keies.slice(ind, 1);
						length--;
					}
					return ov;
				}
				else if(isA(key)){
					rel = [];
					c = false;
					for(var i=0, len = key.length; i<len; i++){
						k = key[i];
						ov = data[k];
						delete data[key];
						if(undefined === ov){
							rel.push(undefined);
						}
						else{
							rel.push(ov);
							c = true;
							ind = keies.indexOf(k);
							if(ind > -1){
								keies.slice(ind, 1);
								length--;
							}
						}
					}
				}
				return c ? rel : undefined;
			}
			
			/**
			 * 返回true表示当前数据是空的，即count方法返回值等于0；
			 *
			 * @return {Boolean} 返回true表示当前数据是空的。
			 */
			me.isEmpty = function(){
				return 0 === length;
			}
			/**
			 * 获取指定key的值
			 *
			 * @param {String} key 键值
			 * @return {Object} 之前设定的值
			 */
			me.get = function(key){
				return data[key];
			}
			/**
			 * 设定属性值
			 * 
			 * @param {String/Object/Record} key 当为一个字符串的时候，会认定这是一个属性名；
			 *									 当为一个Record对象的时候，则认为使用这条数据中的各项值来覆盖当前这条数据；
			 *									 当为一个普通数据对象的时候，则认为使用这个对象为一个key/value形式的名值对，并使用这些值来覆盖当前这条数据。
			 * @param {Object} value 所设定的值，可以使任何一个对象，但当等于undefined的时候，则会认为需要从当前这条数据中移除这项数据(当key等于一个字符串时是这样认为的)。
			 * @return {Record} this
			 */
			me.put = function(key, value){
				if(editing){
					editBatch.push({
						inkove : 'putByInner',
						params : [key, value]
					})
				}
				else{
					var c = putByInner(key, value);
					if(c){
						me.fireEvent('changed', me);	
					}
				}
				return me;
			}
			/**
			 * 移除指定的数据项，并返回这个数据项之前设定的值
			 * <p>
			 * 
			 * @param {String/Array} key 期望移除的数据项键值或这些键值组成的数组
			 * @return {Object/Array} 所移除的数据项得值；如果key传入的是一个字符串，则返回之前设定的值；如果是一个数组，则返回一个同样长度的数组。如果在事务模式下，会返回undefined
			 */
			me.remove = function(key){
				if(editing){
					editBatch.push({
						inkove : 'removeByInner',
						params : [key]
					});
					return undefined;
				}
				else{
					var c = removeByInner(key);
					if(c){
						me.fireEvent('changed', me);
					}
					return c;
				}
			}
			/**
			 * 获得当前所配置数据项的长度。
			 */
			me.count = function(){
				return length;
			}
			/**
			 * 以数组形式返回当前数据中设定项的键。
			 * @return {Array} 以项的键组成的数组。
			 */
			me.keies = function(){
				return keies.slice(0);
			}
			/**
			 * 以数组形式返回当前数据中设定项的值。
			 * @return {Array} 以项值组成的数组。
			 */
			me.values = function(){
				var i,rel = [];
				for(i in data){
					rel.push(data[i]);
				}
				return rel;
			},
			/**
			 * 以数组形式返回当前数据中设定的数据项；这个数组中每一项都是一个包含有key和value属性的对象。
			 *
			 * @return {Array} 包含有key和value属性的对象组成的数组。
			 */
			me.entrys = function(){
				var i, rel = [];
				for(i in data){
					rel.push({
						key : i,
						value : data[i]
					});
				}
			} 
			/**
			 * 以名值对的形式，返回当前数组中设定的数据。其属性名为键，属性值为值。
			 *
			 * @return {Object} 以项的键为属性名，项的值为属性值的数据对象。
			 */
			me.data = function(){
				return Cmp.apply({}, data);
			}
			/**
			 * 开启事务模式
			 * <p>
			 * 开启事务模式后，在调用put，remove这两个方法时，并不会立即生效且不会发送'changed'事件。
			 * 只有当调用commit或者是endEdit方法时，才会生效。
			 */
			me.beginEdit = function(){
				if(false === editing){
					editBatch = [];
				}
				editing = true;
				return me;
			}
			
			/**
			 * 取消事务模式，并撤销之前所得编辑操作
			 */
			me.cancelEdit = function(){
				editBatch = undefined;
				editing = false;
				return me;
			}
			/**
			 * 提交之前所做的编辑，并继续保持在事物模式。
			 *
			 * @return {Boolean} 返回true表示之前进行过修改。
			 */
			me.commit = function(){
				if(true === editing){
					var i = 0,
						batchs = editBatch.splice(0),
						len = batchs.length,
						b,c = false;
					
					for(;i<len;i++){
						b = batchs[i];
						if('removeByInner' === b.inkove){
							if(undefined !== removeByInner(b.params[0])){
								c = true;
							}
						}	
						else if('putByInner' === b.inkove){
							if(true === putByInner(b.params[0],b.params[1])){
								c = true;
							}
						}
					}
					if(c){
						me.fireEvent('changed', me);
						return true;
					}
				}
				
				return false;
			}
			/**
			 * 结束事务模式，并使之前所做的编辑操作生效。
			 */
			me.endEdit = function(){
				me.commit();
				me.cancelEdit();
			}
			
			
			//初始化数据
			if(isA(config.allowKeies) && config.allowKeies.length > 0){
				allowKeies = config.allowKeies.slice(0);
			}
			
			if(isO(config.value)){
				for(var k in config.value){
					if(!allowKeies || allowKeies.indexOf(k) > -1){
						data[k] = config.value[k];
						keies.push(k);
					}
				}
				length = keies.length;
			}
		}
	});
	
		
	Cmp.define('Cmp.util.Record',{
		factory : function(){
			return Record;
		}
	});
}());