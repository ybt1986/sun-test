/**
 * 对于一组具有相同属性的数据条目集合的数据结构类。
 * <p>
 * 这种数据结构可以看成是数据库中一张库表。我们可以先对这个数据结构进行定义，再往里添加数据 
 *
 * @abstract
 * @class Cmp.util.TableModel
 * @extend Cmp.util.Observable
 * 该类有两个典型子类，如下：
 * @subclass Cmp.util.ArrayTableModel
 * @subclass Cmp.util.MapTableModel
 * 
 * @version 1.0.0
 * @since 2015-10-31
 * @author Jinhai
 */
(function(){
	var UV = Cmp.util.ValueHelper,
		Record;
	/**
	 * 对指定的数据进行排序，并返回排序后的数据。
	 * @param {Array} records 排序数据
	 * @param {sortInfo} sortInfo 排序设定，对象具有两个属性，为key和dir;前者为排序键，后者为排序方向('asc'或'desc',默认为'asc');
	 */
	var sort = function(records, sortInfo){
		if(!isA(records) || records.length == 0
			||  !sortInfo || !sortInfo.key){
			return records;
		}
		
		var k = sortInfo.key,
			d = 'desc' == sortInfo.dir;
		records.sort(function(r1, r2){
			var v1 = r1.get(k);
			var v2 = r2.get(k);
			return d ? -UV.compare(v1, v2) : UV.compare(v1, v2);
		});			
		return records;
	}
	
	/**
	 * 对指定的数据进行过滤，并返回符合条件的数据。
	 * @param {Array} records 过滤的数据。
	 * @param {Object} filterInfo (可选)过滤要求，如果不去设定，就相当于取消之前的过滤设定。对象具有属性如下：
	 * 		<li> {Function} compare (可选)对Record进行过滤得比较方法。调用该方法将会传入一个Record对象，如果符合要求，则返回true;
	 *		<li> {Object} scope (可选)调用compare方法时设定的this对象。只有设定compare时有效
	 * 		<li> {String/Object} key (可选) 没设定compare时有效，当为一个对象的时候，则表示对多个键进行比对，这个对象的属性对则是一个键和键值的匹配条件。当是一个字符串时为需要比对的键名称，
	 *		<li> {Object} value (可选) 需要比对键的值，没设定compare且设定了key为一个字符串时有效
	 */
	var filter = function(records, filter){
		if(!isA(records) || records.length == 0){
			return [];
		}
		if(!filter){
			return records.slice(0);
		}
		
		var rel,
			comp = filter.compare;
		if(isF(comp)){
			rel = [];
			Cmp.each(records, function(r){
				if(comp.call(filter.scope || {}, r)){
					rel.push(r);
				}
			});
			return rel;
		}
		
		if(isS(filter.key)){
			var o = {};
			o[filter.key] = filter.value
			filter.key = o;
		}
		if(isO(filter.key)){
			var i,v,av,c,
				o = filter.key,
				rel = [];
			Cmp.each(records, function(r){
				c = true;
				for(i in o){
					av = o[i];
					v = r.get(i);
					if(0 !== UV.compare(v, av)){
						c = false;
					}
				}
				if(c){
					rel.push(r);
				}
			});
			return rel;
		}
		
		return records.slice(0);
	}
	
	
	/**
	 * 将指定数据放到当前数据最后面；
	 * 该方法只会将传入数据转换为Reocrd并放到属性values的最后面；
	 * 
	 * @return {Boolean/Array} 返回false表示没有添加任何数据，否则返回Record对象实例组成的数组。；
	 */
	var doInsert = function(values){
//		putLog('TableModel#doInsert>');
		if(isO(values) && !isA(values)){
			values = [values];
		}
		if(!isA(values)){
			return false;
		}	
		var me = this,
			i = 0,
			len = values.length,
			rel = [],
			r,rid;
		
		for(;i<len;i++){
			r = me.createRecord(values[i]);
			if(!r){
				continue;
			}
			r.on('changed', onRecordChanged, me);
			
			if(true === me.editing){
				//如果当前进入了事务状态，则也需要这个也进入事务状态。
				r.beginEdit();
			}
			me.values.push(r);
			rel.push(r);
			if(false !== me.idKey){
				rid = r.get(me.idKey);
				me.idValues[rid] = r;
			}
		}
		
		if(me.filterInfo){
			rel = filter(rel, me.filterInfo);
		}
		
		
		if(me.resultValues && rel.length > 0){
			Cmp.each(rel, function(r){
				me.resultValues.push(r);
			});
			//排序
			if(me.sortInfo){
				me.resultValues = sort(me.resultValues, me.sortInfo);
			}
		}
		
		return 0 === rel.length ? false : rel;
	}
	/**
	 * 数据实际删除方法。
	 * @param {Mixed} records 由Record实例或者是Record Id 组成的数组。
	 * @return {Boolean/Array} 返回false表示没有删除任何数据，否则就是返回所删除Record组成的数组。
	 */
	var doRemove = function(records){
//		putLog('TableModel#doRemove>');
		if(isS(records) 
			|| (records instanceof Record)){
			records = [records];
		}
		if(!isA(records)){
			return false;
		}
		
		var me = this,
			vs = me.values,
			idk = me.idKey,
			idvs = me.idValues,
			i = 0,
			len = records.length,
			rel = [],
			v,r,ri;
			
		for(;i<len;i++){
			v = records[i];
			if(isS(v)){
				r = idvs ? idvs[v] : false;
			}
			else if(v instanceof Record){
				r = v;
				v = idk ? r.get(idk) : false;
			}
			
			//从队列里面删除
			ri = vs.indexOf(r);
			if(ri > -1){
				vs.splice(ri, 1);
				//从影射里面删除
				if(idvs){
					delete idvs[v];
				}
				
				//清除绑定事件。
				r.purgeListeners();
				
				//放入结果集
				rel.push(r);
			}
		}
		
		if(rel.length > 0){
			//重新构建返回结果集
			me.resultValues = filter(me.values, me.filterInfo);
			//重新排序
			me.resultValues = sort(me.resultValues, me.sortInfo);
			return rel;	
		}
		else{
			return false;
		}
		
	}
	
	/**
	 * 响应数据条目属性发生了变化后的处理逻辑。
	 */
	var onRecordChanged = function(r){
		var me = this;
		if(true !== me.editing){
			//不在事务状态时候，需要分发事件；并重新进行过滤
			
			//过滤
			me.resultValues = filter(me.values, me.filterInfo);
			//重新排序
			me.resultValues = sort(me.resultValues, me.sortInfo);
			
			me.fireEvent('edit', me, r);
			me.fireEvent('changed', 'edit', me, r);
		}
	}
	/**
	 * 编辑操作影射。
	 */
	var EDIT_HANDLER = {
		insert : doInsert,
		remove : doRemove
	}; 
	
	
	/**
	 * 比对两个过滤条件设定的是否相等。如果相等则返回true。
	 * 
	 */
	var compareFilter = function(of, nf){
		if(of == nf){
			return true;
		}
		if(of == undefined || nf == undefined){
			return false;
		}
		//获取所有的属性名
		var getNames = function(o){
			var ms = [];
			for(var i in o){
				ms.push(i);
			}
			return ms;
		}
		
		var oms = getNames(of),
			nms = getNames(nf);
		//配置属性名不一样，返回false。
		if(!UV.compareArray(oms, nms)){
			return false;
		}	
		var n,ov,nv;
		for(var i=0, len = oms.length; i< len;i++){
			n = oms[i];
			ov = of[n];
			nv = nf[n];
			if(0 !== UV.compare(ov, nv)){
				return false;
			}
		}
		return true;
	}	
	Cmp.define('Cmp.util.TableModel',{
		extend : 'Cmp.util.Observable',
		requires : [
			'Cmp.util.Record'
		],
		factory : function(ext, reqs){
			var superClass = ext.prototype;
			Record = reqs[0];
			return Cmp.extend(ext, {
				/**
				 * @cfg {Array} keies (必须)每个字段都具备的键。数组中每一项都是一个字符串(注意大小写)。
				 */
				/**
				 * @cfg {Number} idIndex (可选)可以作为ID的键，在keies配置数组上的次序。如果不设定，则使用getById方法是一律返回undefined;
				 */
				/**
				 * @cfg {Array} values (可选)初始创建时所具备的数据；每一项为一个数据对象，通过该对象可以创建一个Record实例。
				 */
				/**
				 * @cfg {Object} sort (可选)初始时的排序要求。对象具有两个属性，为key和dir;前者为排序键，后者为排序方向('asc'或'desc',默认为'asc');
				 */ 
				/**
				 * @cfg {Object} filter (可选)初始时的过滤要求，对象具有属性如下：
				 * 		<li> {Function} compare (可选)对Record进行过滤得比较方法。调用该方法将会传入一个Record对象，如果符合要求，则返回true;
				 *		<li> {Object} scope (可选)调用compare方法时设定的this对象。只有设定compare时有效
				 * 		<li> {String/Object} key (可选) 没设定compare时有效，当为一个对象的时候，则表示对多个键进行比对，这个对象的属性对则是一个键和键值的匹配条件。当是一个字符串时为需要比对的键名称，
				 *		<li> {Object} value (可选) 需要比对键的值，没设定compare且设定了key为一个字符串时有效
				 */
				/**
				 * @constructor
				 */
				constructor : function(config){
					var me = this;
					config = config || {};
					me.keies = isA(config.keies) ? config.keies : [];
					me.values = [];
					
					//作为ID的键名称
					me.idKey = false;
					//以ID为属性名，{Record}实例为值得名值对。如果等于false则说明没有设定为ID的键名称
					me.idValues = false; 
					
					if(isN(config.idIndex) && config.idIndex < me.keies.length){
						me.idValues = {};
						me.idKey = me.keies[config.idIndex];
					}
					
					doInsert.call(me, config.values);
					
					me.resultValues = filter(me.values, config.filter);
					me.filterInfo = config.filter;
					
					me.resultValues = sort(me.resultValues, config.sort);
					me.sortInfo = config.sort;
					
					
					me.addEvents(
						/**
						 * @event
						 * 因设定排序条件导致返回结果集的顺序发生变化后，分发该事件。
						 * @param {TableModel} this
						 */
						'sort',
						/**
						 * @event
						 * 因设定过滤条件导致返回结果集数量发生变化后，分发该事件。
						 * @param {TableModel} this
						 */
						'filter',
						/**
						 * @event
						 * 因返回结果集中的一条数据发生了变化后，分发该事件。
						 * @param {TableModel} this
						 * @param {Record} record 发生变化的数据
						 */ 
						'edit',
						/**
						 * @event
						 * 因调用添加数据方法，导致返回结果集发生后，分发该事件。
						 * @param {TableModel} this
						 * @param {Array} records 新增数据
						 */
						'insert',
						/**
						 * @event
						 * 因调用删除数据方法导致返回结果集发生后，分发该事件。
						 * 
						 * @param {TableModel} this
						 * @param {Array} records 删除数据
						 */ 
						'remove',
						/**
						 * @event
						 * 因调用重设数据方法导致返回结果集发生了变化后，分发该事件。
						 * @param {TableModel} this
						 */
						'reload',
						/**
						 * @event
						 * 数据结果集发生变化后，触发因素有以下几种：
						 * 1> 返回结果集中的一条或多条数据发生了变化。
						 * 2> 因设定过滤条件导致返回结果集数量发生变化。
						 * 3> 因设定排序条件导致返回结果集的顺序发生变化。
						 * 4> 因调用添加、删除、重设数据方法导致返回结果集发生了变化。
						 * 
						 * @param {String} type 变化类型，如：sort,filter,edit,reload,insert,remove,commit
						 * @param {TableModel} this 
						 * @param {Mixed} records 如果为insert,remove,edit这三种事件，该参数则是其变化数据
						 */
						'changed'
					);
					superClass.constructor.call(me, config);
				},
				/**
				 * 新增数据
				 * <p>
				 * 新增的数据会添加到数据结构中，然后根据当前设定的过滤条件和排序要求放入返回结果集中。
				 * 如果有数据放入结果集，将会触发'insert'和'changed'事件。
				 * 如果当前处于事务状态，则不会立即生效。而需要等到endEdit或者是commit之后才会生效。
				 *
				 * @param {Array} values 对象数组，每一个对象都可以被创建成一个Record，也就是这个数据对象要具有该结构所生命的键名。
				 * @return {TableModel} this
				 */
				insert : function(values){
					var me = this;
		//			putLog('TableModel#insert> values:'+JSON.stringify(values));
					if(true === me.editing){
						me.editBatch.push({
							invoke : 'insert',
							params : values
						});
					}
					else{
						var rs = doInsert.call(me, values);
						if(rs){
							me.fireEvent('insert',me, rs);
							me.fireEvent('changed', 'insert', me, rs);
						}
					}
					return me;
				},
				/**
				 * 删除数据
				 * <p>
				 * 该方法会将指定的数据从结构中删除，如果被删除的数据在结果集中，则会触发'remove'和'changed'事件。
				 * 如果当前处于事务状态，则不会立即生效。
				 * 
				 * @param {Mixed} records 由Record实例或者是Record Id 组成的数组。
				 * @return {TableModel} this
				 */
				remove : function(records){
					var me = this;
					if(true === me.editing){
						me.editBatch.push({
							remove : 'remove',
							values : records
						});
					}
					else{
						var rs = doRemove.call(me, records);
						if(rs){
							me.fireEvent('remove',me, rs);
							me.fireEvent('changed', 'remove', me, rs);
						}
					}
					return me;
				},
				/**
				 * 通过次序值，删除数据
				 * <p>
				 * 这个次序值指的是返回结果中的次序，而不是结构中的数据。也就是说，该方法不能删除被过滤得数据 
				 * 该方法不支持事务性操作，如果要用事务删除数据，则需要使用remove。也就是说如果成功删除数据，将会触发'remove'和'changed'事件。
				 * 
				 * @param {Array/Number} index 由次序值或者是这些值组成的数组。
				 * @return {TableModel} this
				 */
				removeByIndex : function(index){
					var me = this;
					if(true !== me.editing){
						index = isN(index) ? [index] : index;
						var rs = [],
							i = 0,
							len = isA(index) ? index.length : 0,
							crs = me.resultValues,
							count = crs.length,
							ci;
							
						for(;i<len;i++){
							ci = index[i];
							if(ci > -1 && ci < count){
								rs.push(crs[ci]);
							}
						}
						
						rs = doRemove.call(me, rs);
						if(rs){
							me.fireEvent('remove',me, rs);
							me.fireEvent('changed', 'remove', me, rs);
						}	
					}
					return me;
				},
				/**
				 * 使用新的数据替换当前数据结构中的数据。
				 * <p>
				 * <p>
				 * 调用该方法会触发'reload'事件和'changed'事件
				 * <p>
				 * 该方法被设定为一个强制性模式，也就是说即使当前在事务模式下，也会进行数据操作。不过它会取消掉在此之前所有的编辑操作
				 * 之后再将这些数据读入结构中。最后还会保持在事务模式下。
				 * 
				 * @param {Array} values 对象数组，每一个对象都可以被创建成一个Record，也就是这个数据对象要具有该结构所生命的键名。
				 * @return {TableModel} this
				 */
				reload : function(values){
					var me = this;
					
					if(true === me.editing){
						//清空之前的操作
						me.editBatch.splice(0,me.editBatch.length);
					}
					
					//清空当前数据
					var vs = me.values,
						len = vs.length;
					while(len--){
						vs[len].purgeListeners();
					}	
					if(me.idKey){
						me.idValues = {};
					}
					me.values = [];	
					me.resultValues = [];
					
					if(!Cmp.isArray(values) || values.length == 0){
						me.fireEvent('reload', me);
						me.fireEvent('changed', 'reload', me);
						return me;
					}
					
					var rs = doInsert.call(me, values);
					if(rs){
						me.fireEvent('reload', me);
						me.fireEvent('changed', 'reload', me);
					}
					
					return me;
				},
				/**
				 * 获取指定位置的数据
				 *
				 * @param {Number} index 指定位置索引值，如果是第一个则等于0；默认为0；
				 * @param {Number} limit 返回数据的最大长度。如果不设定，则等于当前具备数据的数量。
				 * @return {Array} Record对象组成的数组。如果超出范围则返回长度为0的数组。
				 */
				getRecords : function(index, limit){
					var me = this,
						crs = me.resultValues,
						end;
					
					index = isN(index) ? index : 0;
					if(index < 0 || index >= crs.length){
						//超出范围，返回长度为0的数组。
						return [];
					}
					
					limit = isN(limit) ? limit : crs.length;
					end = index+limit;
					if(end > crs.length){
						end = crs.length;
					}
					
						
					return crs.slice(index, end);
				},
				/**
				 * 以指定键为比较基础，对当前数据进行排序。
				 * @param {String} key (必须)键名称
				 * @param {String} dir (可选)排序方向，可配置'asc'||'desc'; 默认为'asc'
				 * @return {TableModel} this
				 */
				sort : function(key, dir){
					var me = this,
						info = me.sortInfo;
		
		//			putLog('TableModel#sort>key:'+key+', dir:'+dir);
					
					if(info && info.key === key && info.dir === dir){
						return me;
					}
					me.sortInfo = {
						key : key,
						dir : dir
					};
					sort.call(me, me.resultValues, me.sortInfo);
					me.fireEvent('sort', me);
					me.fireEvent('changed', 'sort', me);
					return me;
				},
				/**
				 * 遍历当前数据，返回符合条件的数据项。
				 * <p>
				 * 注意：该方法只在当前设定的过滤条件下，在此进行寻找。而不是从数据结构中所有的数据条目中查找。
				 *
				 * @param {String/Object/Function} key (必须)
				 *							  当为一个字符串的时候，表示只对一个键进行比对，此时value参数为这个键的值。
				 *							  当为一个对象的时候，则表示对多个键进行比对，这个对象的属性对则是一个键和键值的匹配条件。
				 *							  当为一个方法的时候，则在遍历过程中，调用该方法，并将一个Record传入，如果符合条件就返回true。
				 * @param {Object} value 比对值
				 * @return {Array} 符合条件的由Record对象组成的数组。
				 */
				find : function(key, value){
					var me = this,
						crs = me.resultValues,
						callFn,
						rel = [];
					
					if(isS(key)){
						callFn = function(r){
							return value === r.get(key);
						}
					}
					else if(isO(key)){
						callFn = function(r){
							var rel = true;
							for(var i in key){
								value = r.get(i);
								if(value !== key[i]){
									rel = false;
									break;
								}
							}
							return rel;
						}
					}
					else if(isF(key)){
						callFn = key;
					}	
					
					if(isF(callFn)){
						Cmp.each(crs, function(r){
							if(true === callFn(r)){
								rel.push(r);
							}
						});
					}
					return rel;
				},
				/**
				 * 设定过滤条件；设定过滤条件后，所有获取数据方法所返回数据都是基于这个过滤条件的。
				 * 这些方法包括：getRecords(), find(), getCount(), getAt()。
				 *
				 *
				 * @param {Object} filterInfo (可选)过滤要求，如果不去设定，就相当于取消之前的过滤设定。对象具有属性如下：
				 * 		<li> {Function} compare (可选)对Record进行过滤得比较方法。调用该方法将会传入一个Record对象，如果符合要求，则返回true;
				 *		<li> {Object} scope (可选)调用compare方法时设定的this对象。只有设定compare时有效
				 * 		<li> {String/Object} key (可选) 没设定compare时有效，当为一个对象的时候，则表示对多个键进行比对，这个对象的属性对则是一个键和键值的匹配条件。当是一个字符串时为需要比对的键名称，
				 *		<li> {Object} value (可选) 需要比对键的值，没设定compare且设定了key为一个字符串时有效
				 * @return {TableModel} this
				 */
				filter : function(filterInfo){
					var me = this;
					
		//			putLog('TableModel#filter>filterInfo:'+JSON.stringify(filterInfo));
					if(compareFilter(me.filterInfo, filterInfo)){
						return me;
					}
					
					me.filterInfo = filterInfo;
					//过滤
					me.resultValues = filter(me.values, me.filterInfo);
					//重新排序
					me.resultValues = sort(me.resultValues, me.sortInfo);
					
					//分发：filter 事件
					me.fireEvent('filter', me);
					me.fireEvent('changed', 'filter', me);
					
					return me;
				},
				/**
				 * 获取指定位置的一条数据，相当于调用getRecords(index, 1)这样的方法。
				 * 
				 * @param {Number} index 指定位置的次序值，默认为0；
				 * @return {Record} Record对象实例，如果超出范围则返回unfined
				 */
				getAt : function(index){
					var me = this,
						crs = me.resultValues;
					index = isN(index) ? index : 0;
					if(index < 0){
						//超出范围，返回长度为0的数组。
						return undefined;
					}
					
					return crs[index];
				},
				/**
				 * 根据Record的ID获取一条数据。使用该方法，必须设定可以作为ID的键名。
				 * <p>
				 * 该方法是忽略当前设定的过滤条件的。
				 *
				 * @return {Record} Record对象实例，如果没有则返回unfined
				 */
				getById : function(recordId){
					var me = this;
					return me.idValues ? me.idValues[recordId] : undefined;
				},
				/**
				 * 获得当前返回结果集的长度。
				 */
				count : function(){
					return this.resultValues.length;
				},
				/**
				 * 开启事务模式。当开启事务后对于当前数据结构中的数据进行添加、修改、删除等操作，都不会立即生效。
				 * 只会当调用commit或者是endEdit的时候；所作的修改才会生效。
				 * 另外事务性的操作只会触发'changed'事件。
				 * @return {TableModel} this
				 */
				beginEdit : function(){
					var me = this;
					if(!me.editing){
						me.editBatch = [];
						
						var len = me.values.length;
						while(len--){
							me.values[len].beginEdit();
						}
					}
					me.editing = true;
					return me;
				},
				/**
				 * 停止事务模式，并取消之前的编辑操作
				 * @return {TableModel} this
				 */
				cancelEdit : function(){
					var me = this;
					delete me.editBatch;
					var len = me.values.length;
					while(len--){
						me.values[len].cancelEdit();
					}
					me.editing = false;
					return me;
				},
				/**
				 * 提交之前做的编辑操作，并继续保持在事务模式下。
				 * <p>
				 * 如果之前有编辑操作，则会触发'changed'事件。
				 * @return {Boolean} 返回true表示之前做过修改。
				 */
				commitEdit : function(){
					var me = this;
					if(true === me.editing){
						var bs = me.editBatch.splice(0,me.editBatch.length),
							i = 0,
							len = bs.length,
							b,call,c = false;
						
						//细粒度数据级别。
						var len = me.values.length;
						while(len--){
							if(true == me.values[len].commit()){
								c = true;
							}
						}	
						if(c){
							//过滤
							me.resultValues = filter(me.values, me.filterInfo);
							//重新排序
							me.resultValues = sort(me.resultValues, me.sortInfo);
						}
							
						for(;i<len;i++){
							b = bs[i];
							call = EDIT_HANDLER[b.invoke];
							if(isF(call) && false !== call.apply(me, b.params)){
								c = true;
							}
						}
						
						if(true === c){
							me.fireEvent('changed', 'commit', me);
						}
						return c;	
					}
					return false;
				},
				/**
				 * 停止事务模式，并提交之前做的编辑操作。
				 * <p>
				 * 如果之前有编辑操作，则会触发'changed'事件。
				 * @return {TableModel} this
				 */
				endEdit : function(){
					var me = this;
					me.commitEdit();
					me.cancelEdit();
				},
				/**
				 * 返回true表示当前为编辑模式下
				 */
				isEditing : function(){
					return true === this.editing;
				},
				/**
				 * @private
				 * 由子类负责实现的根据传入参数，创建Record实例的功能方法。
				 * @param {Object} value 数据队列中的一项；而数据队列是由insert方法的参数或者是创建数据结构时配置参数的values属性中获得的。
				 * @return {Record} Record实例，如果不能创建，则返回undefined或null或false。
				 */
				createRecord : Cmp.emptyFn
			});
		}
	});
}());