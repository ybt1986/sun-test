/**
 * 基础工具和部件包的基础功能脚本。
 * 
 * @static Cmp
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){
	if(!window.Cmp){
		window.Cmp = {
			'version' : '2.0.0'
		};
	}
	
	var toString = Object.prototype.toString;
	
	/**
	 * 验证传入值是一个JS对象
	 * 
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个对象时，返回true；否则返回false
	 */
	Cmp.isObject = function(v){
		return v !== null && typeof v === 'object';
	}
	/**
	 * 验证传入值是一个String对象
	 * 
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个String对象时，返回true；否则返回false
	 */	
	Cmp.isString = function(v){
		return typeof v === 'string';
	}
	/**
	 * 验证传入值是一个Date对象
	 * 
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个Date对象时，返回true；否则返回false
	 */	
	Cmp.isDate = function(v){
		return toString.call(v) === '[object Date]';
	}
	/**
	 * 验证传入值是一个正则表达式对象
	 * 
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个正则表达式对象时，返回true；否则返回false
	 */	
	Cmp.isRegExp = function(v){
		return toString.call(v) === '[object RegExp]';
	}
	/**
	 * 验证传入值是一个Number类型值
	 * 
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个Number类型值时返回true,否则返回false.
	 */ 
	Cmp.isNumber = function(v){
		return typeof v === 'number' && isFinite(v);
	}
	/**
	 * 验证传入值是一个Array对象  
	 * 
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个Array对象时返回true,否则返回false.
	 */
	Cmp.isArray = function(v){
		return toString.call(v) === '[object Array]';
	}
	/**
	 * 验证传入值是一个Function
	 *
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个Function时返回true,否则返回false.
	 */
	Cmp.isFunction = function(v){
		return toString.apply(v) === '[object Function]';
	}
	/**
	 * 验证传入值是一个数组或者是一个集合
	 */
	Cmp.isCollection = function(v){
		if(Cmp.isArray(v) || v.callee){
			return true;
		}
		//check for node list type
           if(/NodeList|HTMLCollection/.test(toString.call(v))){
               return true;
           }
           return ((typeof v.nextNode != 'undefined' || !!v.item) && isN(v.length));
	};
	/**
	 * 验证传入值是一个布尔值
	 *
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个布尔值时返回true,否则返回false.
	 */
	Cmp.isBoolean = function(v){
		return typeof v === 'boolean';
	}
	/**
	 * 断定传入值是一个HTMLElement对象
	 * @param {Mixed} value 测试值
	 * @return {Boolean} 测试值为一个HTMLElement对象时，返回true；否则返回false
	 */
	Cmp.isElement = function(v){
		return v ? !!v.tagName : false;
	};
	/**
	 * 检测指定值是否为空的。
	 */
	Cmp.isEmpty = function(v, allowBlank){
		return v === null || v === undefined 
				|| ((Cmp.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
	}
	/**
	 * 检测传入值是否为undefined
	 */
    Cmp.isDefined = function(v){
		return typeof v !== 'undefined';
	}
	/**
	 * 验证传入值是一个原生类型值，原生类型值包括：字符串(String)，数字(Number)，布尔(Boolean)
	 */
	Cmp.isPrimitive = function(v){return Cmp.isString(v) || Cmp.isNumber(v) || Cmp.isBoolean(v)};
	/**
	 * 判断是否是原生数据，而不是通过构建方法创建出来的;
	 * 原生数据包括：字符串(String)，数字(Number)，布尔(Boolean)，日期类型值(Date)，数组(Array)，不通过否造方法new出来的对象。
	 */
	Cmp.isNative = function(obj){
		if(isO(obj) && !isA(obj)){
			return Object.prototype.constructor === obj.constructor;
		}
		return true;
	}
	
	/**
	 * 拷贝一个对象的所有属性到指定的另一个对象上去
	 * @param {Object} t 目标对象
	 * @param {Object} s 源对象
	 * @param {Object} d 默认配置对象
	 * @return {Object} 目标对象
	 */
	Cmp.apply = function(t,s,d){
		if(d){
	        apply(t, d);
	    }
	    if(t && isO(s)){
	        for(var p in s){
	            t[p] = s[p];
	        }
	    }
	    return t;
	}
	/**
	 * 检测配置对象中的属性在指定对象当中是否存在，如果不存在则拷贝过去，
	 */
	Cmp.applyIf = function(o, c){
		if(o){
			for(var p in c){
            	if(!Cmp.isDefined(o[p])){
                	o[p] = c[p];
				}
             }
         }
         return o;
	}
	/**
	 * 对数组进行遍历，并在遍历过程中调用指定的方法。
	 * array, fn, scope)
	 * @param {Array} array 指定的数组
	 * @paran {Function} fn 指定的调用方法
	 * @param {Object} scope 调用方法时设定的this对象
	 */
	Cmp.each = function(array, fn, scope){
		if(Cmp.isEmpty(array, true)){
			return;
		}
        if(!Cmp.isCollection(array) || Cmp.isPrimitive(array)){
            array = [array];
        }
        for(var i = 0, len = array.length; i < len; i++){
            if(fn.call(scope || array[i], array[i], i, array) === false){
                return i;
            };
        }
	}
	
	/**
	 * 申请命名空间
	 * 
	 * @param {String} args...
	 * @return {Object} 最后一个申请的命名空间对象。
	 */
	Cmp.namespace = function(){
		var o, d;
        Cmp.each(arguments, function(v) {
            d = v.split(".");
            o = window[d[0]] = window[d[0]] || {};
            Cmp.each(d.slice(1), function(v2){
                o = o[v2] = o[v2] || {};
            });
        });
        return o;
	}
	/**
	 * 申请命名空间同于Cmp.namespace方法
	 * 
	 * @param {String} args...
	 * @return {Object} 最后一个申请的命名空间对象。
	 */
	Cmp.ns = Cmp.namespace;
	
	/**
	 * 添加或覆盖指定配置属性到传入的原生类中。
	 *
	 * @param {Function} origclass JS(伪)类的构造方法
	 * @param {Object} overrides 所要覆盖到构造方法上的配置对象 
	 */
	Cmp.override = function(origclass, overrides){
		if(overrides){
			var p = origclass.prototype;
			Cmp.apply(p, overrides);
			if(overrides.hasOwnProperty('toString')){
				p.toString = overrides.toString;
			}
		}
	}
	/**
	 * 对指定的构造方法进行扩展；可以有以下两种实现方式
	 * <p>
	 * 方式一：分别设定扩展构造方法，基础构造方法，扩展配置；如：
	 * extend(subClass, superclass, overrides);
	 * </p>
	 * <p>
	 * 方式二: 设定基础构造方法和扩展配置;返回扩展构造方法;如:
	 * var subClass = extend(superclass, overrides);
	 */
	Cmp.extend = function(){
		var io = function(o){
			for(var m in o){
				this[m] = o[m];
			}
		};
		var oc = Object.prototype.constructor;
		return function(sb, sp, overrides){
			if(typeof sp == 'object'){
            	overrides = sp;
                sp = sb;
                sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
			}
			var F = function(){},
				sbp,
				spp = sp.prototype;
			F.prototype = spp;
			sbp = sb.prototype = new F();
			sbp.constructor=sb;
			sb.superclass=spp;
			if(spp.constructor == oc){
				spp.constructor=sp;
			}
			sb.override = function(o){
				CMP.override(sb, o);
			};
			sbp.superclass = sbp.supr = (function(){
				return spp;
			});
			sbp.override = io;
			Cmp.override(sb, overrides);
			sb.extend = function(o){return Cmp.extend(sb, o);};
			return sb;
		}
	}();
	
	
	
	Cmp.emptyFn = function(){};
	
	//将常用方法覆盖到全局上，并且为短方法
	window.isA = Cmp.isArray;
	window.isF = Cmp.isFunction;
	window.isO = Cmp.isObject;
	window.isN = Cmp.isNumber;
	window.isB = Cmp.isBoolean;
	window.isP = Cmp.isPrimitive;
	window.isE = Cmp.isElement;
	window.isEmp = Cmp.isEmpty;
	window.isS = Cmp.isString;
	window.isD = Cmp.isDate; 
	
	/**
	 * 调用指定方法，并传入指定的参数
	 * @param {Function} fn (必须)方法
	 * @param {Object} scope (可选)调用方法时的this对象
	 * @param {Array} args (可选)调用方法时传入的参数。默认为[]
	 */
	Cmp.invoke = function(fn, scope, args){
		if(isF(fn)){
			fn.apply(scope, isA(args) ? args : []);
		}
	}
	/**
	 * 延迟调用指定方法，并传入指定的参数；
	 * 注意：此处不会造成阻塞，使用的是window.setTimeout()来实现。
	 * @param {Function} fn (必须)方法
	 * @param {Object} scope (可选)调用方法时的this对象
	 * @param {Array} args (可选)调用方法时传入的参数。默认为[]
	 * @param {Array} delay (可选)延迟时间，单位：毫秒；该值不得小于1；默认值： 10；
	 */
	Cmp.delayInvoke = function(fn, scope, args, delay){
		if(isF(fn)){
			delay = !isN(delay) || delay < 1 ? 10 : delay;
			window.setTimeout(function(){
				fn.apply(scope, isA(args) ? args : []);
			}, delay)
		}
	}
	
	//核心工具包
	Cmp.ns(
		'Cmp.util',
		'Cmp.ajax',
		'Cmp.req'
	);
	
	/**
	 * @public
	 * 公共的控制台日志输出方法
	 * @param {String} log 输出日志文字
	 * @param {Number} level 输出界别值，默认为0；可选为：0，1，2，3；
	 * 	依次对应：日志，信息，警告，错误这四个级别
	 */
	window.putLog = function(log, level){
		if(1 === level){
			console.info(log);
		}
		else if(2 === level){
			console.warn(log);
		}
		else if(3 === level){
			console.error(log);
		}
		else{
			console.log(log);
		}
	}
}());
/**
 * 字符串类型的增加一些辅助函数
 * @static
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
Cmp.applyIf(String.prototype, {
	escape : function(string) {
        return string.replace(/('|\\)/g, '\\$1');
    },
	leftPad : function (val, size, ch) {
		 var result = String(val);
        if(!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
	}
});
/**
 * 对于Array类的功能补充。
 * 
 * @static
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
Cmp.applyIf(Array.prototype, {
	/**
	 * 与另一个数据进行比较，如果完全相等则返回true;否则返回false
	 * @param {Array} arrs (必须)另一个数组
	 * @param {Function} cpFn 比较数组中每项相等时使用的方法；届时将传入在同一次序下两个数组的所在项的值，如果相等则返回true;
	 *		没有配置时，默认使用三等号'==='进行比较；
	 */ 
	equals : function(arrs, cpFn){
		if(!isA(arrs)){
			return false;
		}
		var me = this,
			i,
			len = me.length;
		if(len !== arrs.length){
			return false;
		}	
		cpFn = isF(cpFn) ? cpFn : function(o1, o2){
			return o1 === o2;
		}
		for(i=0;i<len;i++){
			if(!cpFn(me[i], arrs[i])){
				return false;
			}
		}	
		
		return true;
			
	},
	/**
	 * 检测指定的对象或值是否存在于当前数组中，如果存在则返回它的下标值；否则返回-1;
	 *
	 * @param {Object} o 检测值
	 * @param {Number} fromIndex (可选)开始检测的下标值，默认为0；
	 * @return {Number} 检测值所在的下标值，如果不存在则返回-1；
	 */
	indexOf : function(o, fromIndex){
		var me = this,
			len = me.length,
			i = fromIndex || 0;
		i += (i < 0) ? len : 0;
		for(;i<len;i++){
			if(me[i] === o){
                return i;
            }
		}
		return -1;
	},
	/**
	 * 删除指定的对象。如果不存在则忽略。
	 * @param {Object} o 指定对象
	 * @reutrn {Array} this
	 */
	remove : function(o){
        var me = this,
        	index = me.indexOf(o);
        if(index != -1){
            me.splice(index, 1);
        }
        return me;
    }
});
/**
 * 对于Function的功能补充。
 * 
 * @static
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
Cmp.applyIf(Function.prototype, {
	/**
	 * 为该方法设定一个过滤方法，当过滤方法返回false时，该方法将不会被调用；
	 * <p>
	 * 例如：
	 * //原生方法
	 * function sayHello = function(name){
	 *		alert('Hello '+name);
	 * }
	 * sayHello('Jinhai'); //此时弹出警告框，并显示'Hello Jinhai'
	 * //设定过滤方法，当传入值等于'Jinhai'时返回false
	 * sayHello = sayHello.createInterceptor(function(n){
	 * 		return 'Jinhai' != n;
	 * });
	 * sayHello('Jinhai'); 	//再次调用，将不会弹出警告框
	 * sayHello('LiuYiFei');//使用其他名字作为参数传入时，可以弹出警告框
	 *
	 * @param {Function} fcn 过滤方法，如果该方法明确返回false，那么原生的方法将不会被调用。
	 * @param {Object} scope 调用过滤方法时的this对象设定。
	 * @reutrn {Function} 一个新的方法。
	 */
	createInterceptor : function(fcn, scope){
		var method = this;
        return !isF(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
	},
	/**
	 * 创建预定义的回调方法，并且可以自行定义设定的参数。
	 * @reutrn {Function} 一个新的方法。
	 */
	createCallback : function(){
		var args = arguments,
			fn = this;
		return function() {
            return fn.apply(window, args);
        };
	},
	/**
	 * 创建具有代理桩性质的方法，使之可以设定this为指定的对象
	 * @param {Object} obj 调用时的this对象设定
	 * @param {Array} args (可选) 调用时传入参数
	 * @param {Boolean} appendArgs (可选)等于true将设定的args参数值添加到调用时设定参数的后面去；否则完全使用args参数
	 * @reutrn {Function} 一个新的方法。
	 */
	createDelegate : function(obj, args, appendArgs){
		var fn = this;
		return function() {
			var callArgs = args || arguments;
			if (appendArgs === true){
				callArgs = Array.prototype.slice.call(arguments, 0);
				callArgs = callArgs.concat(args);
			}
			else if (isN(appendArgs)){
                callArgs = Array.prototype.slice.call(arguments, 0); 
                var applyArgs = [appendArgs, 0].concat(args); 
                Array.prototype.splice.apply(callArgs, applyArgs);
            }
            return fn.apply(obj || window, callArgs);
		}
	},
	/**
	 * 延迟调用
	 * @param {Number} defer 延迟时间，单位:毫秒;
	 * @param {Object} obj 调用时的this对象设定
	 * @param {Array} args (可选) 调用时传入参数
	 * @param {Boolean} appendArgs (可选)等于true将设定的args参数值添加到调用时设定参数的后面去；否则完全使用args参数
	 * @reutrn {Number} 延迟调用方法的ID值。
	 */
	defer : function(defer, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(defer > 0){
            return setTimeout(fn, defer);
        }
        fn();
        return 0;
    }

});
/**
 * 日期类型的增加一些辅助函数
 * @static
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){
	
	/**
	 * 返回true表示传入的年份为闰年
	 */
	var isLeapYear = function(year){
		return 0 === year % 400 
			|| (0 !== year % 100 && 0 === year % 4);
	}
	
	/**
	 * 获得指定月份的天数量
	 * @param {Number} year (必须)公历年份值，如：2016
	 * @param {Number} month (必须)月份值，1月份得值等于0；12月份的值等于11； 
	 * @return {Number} 天数量；
	 */
	var getDaysOfMonth = function(year, month){
		if(!isN(year) || 
			!isN(month) || 
			month < 0 || month > 11){
			return -1;
		}
		switch(month){
			//二月份	
			case 1:
				if(isLeapYear(year)){
					//闰年
					return 29;
				}
				else{
					//平年
					return 28;
				}
			//四月
			case 3:
			//六月
			case 5:
			//九月
			case 8:
			//十一月
			case 10:
				return 30;
			//一，三，五，七，八，十，十二月份	
			default :
				return 31	
		}
	}

	var AddValue = {
		//天单位的偏移量计算
		day : function(offset){
			//24*60*60*1000
			var t = this.getTime() + offset*86400000;
			return new Date(t);
		},
		//年单位的偏移量计算
		year : function(offset){
			var me = this,
				off = Math.floor(offset);
			if(off > offset || off < offset){
				//传入值为浮点
				var y = me.getFullYear();
				var t = me.getTime() + 
					(offset*(isLeapYear(y) ? 31622400000:31536000000));
				return new Date(t);	
			}
			else{
				var aar = me.toArrayValue(),
					y = arr[0] + offset;
				return new Date(y, arr[1], arr[2],arr[3],arr[4],arr[5]);	
			}
		},
		//月单位的偏移量计算
		month : function(offset){
			var me = this,
				off = Math.floor(offset);
			if(off > offset || off < offset){
				//传入值为浮点
				var y = me.getFullYear(),
					m = me.getMonth();
					
				var t = me.getTime() + offset*86400000*getDaysOfMonth(y,m);
				return new Date(t);	
			}	
			else{
				var vs = me.toArrayValue(),
					y = vs[0],
					m = vs[1]+offset;
				if(m > 11){
					y = y+Math.floor(m/12);
					m = m % 12;
				}
				else if(m < 0){
					y = y+Math.floor(m/12);
					m = m % 12 + 12;
				}
				
				return new Date(y, m, arr[2], arr[3], arr[4], arr[5]);
			}
		},
		//周单位的偏移量计算
		week : function(offset){
			var t = this.getTime() + offset*604800000;
			return new Date(t);
		},
		//小时单位的偏移量计算
		hour : function(offset){
			var t = this.getTime() + offset*3600000;
			return new Date(t);
		},
		//分钟单位的偏移量计算
		minute : function(offset){
			var t = this.getTime() + offset*60000;
			return new Date(t);
		},
		//秒单位的偏移量计算
		second : function(offset){
			var t = this.getTime() + offset*1000;
			return new Date(t);
		}
	};

	var MonthName = [
		'January','February','March','April','May','June',
        'July','August','September','October','November','December'
	];
	var MonthSortName = [
		'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'
	];
	var MonthCnName = [
		'一月','二月','三月','四月','五月','六月',
		'七月','八月','九月','十月','十一月','十二月',
	];
	var MonthCnSortName = [
		'一','二','三','四','五','六',
		'七','八','九','十','十一','十二',
	];
	var MonthCnNeatName = [
		'一月','二月','三月','四月','五月','六月',
		'七月','八月','九月','十月','十一','十二',
	];
	
	var DayNames = [
		'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
    ];
    var DaySortNames = [
        'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
    ];
    var DayCnNames = [
        '星期日','星期一','星期二','星期三','星期四','星期五','星期六'
    ];
    var DayCnSortNames = [
        '周日','周一','周二','周三','周四','周五','周六'
    ];
    var DayCnMiniNames = [
        '日','一','二','三','四','五','六'
    ];

	var ValueFormats = {
		//Y	: 年份全值，如2016年输出就是2016
		'Y' : function(vs){
			return ''+vs[0];
		},
		//Ys 	: 二位的年份值，如2016年输出就是16
		'Ys' : function(vs){
			var v = vs[0]%100;
			return (v < 10 ? '0'+v : ''+v);
		},
		//M 	: 二位月份值，如一月输出为01，十二月输出为：12；
		'M' : function(vs){
			var v = vs[1]%12+1;
			return (v < 10 ? '0'+v : ''+v);
		},
		//Mn 	: 月份的数字值，如一月输出为1，十二月输出为：12；
		'Mn' : function(vs){
			var v = vs[1]%12+1;
			return ''+v;
		},
		//Mc 	: 月份长中文字符值，如一月输出为一月，十二月输出为：十二月；
		'Mc' : function(vs){
			var v = vs[1]%12;
			return MonthCnName[v];
		},
		//Mcs 	: 月份短中文字符值，如一月输出为一，十二月输出为：十二；
		'Mcs' : function(vs){
			var v = vs[1]%12;
			return MonthCnSortName[v];
		},
		//Mcn 	: 月份中文二字符形式的字符值，如一月输出为一月，十二月输出为：十二；
		'Mcn' : function(vs){
			var v = vs[1]%12;
			return MonthCnNeatName[v];
		},
		//Me 	: 月份长英文字符值，如一月输出为January，十二月输出为：December；
		'Me' : function(vs){
			var v = vs[1]%12;
			return MonthName[v];
		},
		//Mes 	: 月份短英文字符值，如一月输出为Jan，十二月输出为：Dec；
		'Mes' : function(vs){
			var v = vs[1]%12;
			return MonthSortName[v];
		},
		//Mi 	: 月份在年中的次序数值，如一月输出为0，十二月输出为：11；
		'Mi' : function(vs){
			var v = vs[1]%12;
			return ''+v;
		},
		// D	: 月中日的二位字符值，如1号输出为01,31号输出为31
		'D' : function(vs){
			var v = vs[2];
			return v < 10 ? '0'+v : ''+v;
		},
		// Dn	: 月中日的数字值，如1号输出为1,31号输出为31
		'Dn' : function(vs){
			var v = vs[2];
			return ''+v;
		},
		// d	: 周中日英文值，如周一输出为：Monday
		'd' : function(vs){
			var v = vs[6];
			return DayNames[v];
		},
		// ds	: 周中日英文缩写值，如周一输出为：Mon
		'ds' : function(vs){
			var v = vs[6];
			return DaySortNames[v];
		},
		// dc	: 周中日中文值，如周一输出为：星期一，周日输出为：星期日
		'dc' : function(vs){
			var v = vs[6];
			return DayCnNames[v];
		},
		// dcs	: 周中日缩写中文值，如周一输出为：周一，周日输出为：周日
		'dcs' : function(vs){
			var v = vs[6];
			return DayCnSortNames[v];
		},
		// dcc	: 周中日简写中文值，如周一输出为：一，周日输出为：日
		'dcc' : function(vs){
			var v = vs[6];
			return DayCnMiniNames[v];
		},
		// H	: 小时的二位字符值，如0点输出为00，23点输出为23
		'H' : function(vs){
			var v = vs[3];
			return v < 10 ? '0'+v : ''+v;
		},
		// Hn	: 小时数字值输出，如0点输出为0，23点输出为23
		'Hn' : function(vs){
			var v = vs[3];
			return ''+v;
		},
		// Ho	: 小时以1到24的值范围形式输出，如0点输出为24，23点输出为23，1点输出为01；
		'Ho' : function(vs){
			var v = vs[3];
			return 0 == v ? '24' : (v < 10 ? '0'+v : ''+v);
		},
		// Hm	: 小时以0~11的二位字符值范围形式输出，如0点输出为00，23点输出为11
		'Hm' : function(vs){
			var v = vs[3]%12;
			return v < 10 ? '0'+v : ''+v;
		},
		// Hme	: 当小时之小于12时，输出AM；否则输出PM
		'Hme' : function(vs){
			var v = vs[3];
			return v < 12 ? 'AM' : 'PM';
		},
		// Hmc	: 当小时之小于12时，输出上午；否则输出下午
		'Hmc' : function(vs){
			var v = vs[3];
			return v < 12 ? '上午' : '下午';
		},
		// Hmcm	: 当小时值为(23,0,1)时，输出"深夜”；为(2，3，4)时输出"凌晨”；为(5，6，7)时输出"早晨”；
		//			为(8，9，10)时输出"上午”；为(11，12，13)时输出"中午”；为(14，15，16)时输出"下午”；
		//			为(17，18，19)时输出"傍晚”；为(20，21，22)时输出"夜晚”；
		'Hmcm' : function(vs){
			var v = vs[3];
			switch(v){
				case 0:
				case 1:
					return '深夜';
				case 2:
				case 3:
				case 4:
					return '凌晨';
				case 5:
				case 6:
				case 7:
					return '早晨';
				case 8:
				case 9:
				case 10:
					return '上午';
				case 11:
				case 12:
				case 13:
					return '中午';
				case 14:
				case 15:
				case 16:
					return '下午';
				case 17:
				case 18:
				case 19:
					return '傍晚';
				case 20:
				case 21:
				case 22:
					return '夜晚';
				case 23:
				default : 
					return '深夜';
			}
		},
		// m	: 分钟的二位字符值，如0输出为00，23输出为23
		'm' : function(vs){
			var v = vs[4];
			return v < 10 ? '0'+v : ''+v;
		},
		// mn	: 分钟的数字值输出，如0输出为0，23输出为23
		'mn' : function(vs){
			var v = vs[4];
			return ''+v;
		},
		// S	: 秒钟的二位字符值，如0输出为00，23输出为23
		'S' : function(vs){
			var v = vs[5];
			return v < 10 ? '0'+v : ''+v;
		},
		// Sn	: 秒钟的数字值输出，如0输出为0，23输出为23
		'Sn' : function(vs){
			var v = vs[5];
			return ''+v;
		},
		//W		: 年中周次序值得二位字符值(1~53)，如1输出为01，53输出为53; 且以周日为每周的第一天；
		'W' : function(vs, d){
			var yd = Date.getFristWeekOfYear(vs[0], 0),
				v = d.getTime() - yd.getTime();
				
			v = Math.floor(v / 604800000)+1;
			return v < 10 ? '0'+v : '' + v;
		},
		//WsM  : 每周第一天为周日时的当前时间所属周第一天月份的二位字符值(01~12);
		'WsM' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 0),
				v = wd.getMonth()+1;
			return v < 10 ? '0'+v : '' + v;
		},
		//WsD  : 每周第一天为周日时的当前时间所属周第一天日期的二位字符值(01~31);
		'WsD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 0),
				v = wd.getDate();
			return v < 10 ? '0'+v : '' + v;
		},
		//WsMD : 每周第一天为周日时的当前时间所属周第一天的以{M}-{D}形式的输出字符串
		'WsMD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 0),
				m = wd.getMonth()+1,
				dv = wd.getDate();
				v = [];
				
			v.push(m < 10 ? '0'+m : '' + m);
			v.push(dv < 10 ? '0'+dv : '' +dv);
			return v.join('-');
		},
		//WeM  : 每周第一天为周日时的当前时间所属周最后一天所在月份的二位字符值(01~12);
		'WeM' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 0).add(7),
				v = wd.getMonth()+1;
			return v < 10 ? '0'+v : '' + v;
		},
		//WeD  : 每周第一天为周日时的当前时间所属周最后一天日期的二位字符值(01~31);
		'WeD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 0).add(7),
				v = wd.getDate();
			return v < 10 ? '0'+v : '' + v;
		},
		//WeMD  : 每周第一天为周日时的当前时间所属周最后一天的以{M}-{D}形式的输出字符串
		'WeMD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 0).add(7),
				m = wd.getMonth()+1,
				dv = wd.getDate();
				v = [];
				
			v.push(m < 10 ? '0'+m : '' + m);
			v.push(dv < 10 ? '0'+dv : '' +dv);
			return v.join('-');
		},
		//w	: 年中周次序值得二位字符值(1~53)，如1输出为01，53输出为53; 且以周一为每周的第一天；
		'w' : function(vs, d){
			var yd = Date.getFristWeekOfYear(vs[0], 1),
				v = d.getTime() - yd.getTime();
			v = Math.floor(v / 604800000)+1;
			return v < 10 ? '0'+v : '' + v;
		},
		//wsM  : 每周第一天为周日时的当前时间所属周第一天月份的二位字符值(01~12);
		'wsM' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 1),
				v = wd.getMonth()+1;
			return v < 10 ? '0'+v : '' + v;
		},
		//wsD  : 每周第一天为周一时的当前时间所属周第一天日期的二位字符值(01~31);
		'wsD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 1),
				v = wd.getDate();
			return v < 10 ? '0'+v : '' + v;
		},
		//wsMD : 每周第一天为周一时的当前时间所属周第一天的以{M}-{D}形式的输出字符串
		'wsMD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 1),
				m = wd.getMonth()+1,
				dv = wd.getDate();
				v = [];
				
			v.push(m < 10 ? '0'+m : '' + m);
			v.push(dv < 10 ? '0'+dv : '' +dv);
			return v.join('-');
		},
		//weM  : 每周第一天为周一时的当前时间所属周最后一天所在月份的二位字符值(01~12);
		'weM' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 1).add(7),
				v = wd.getMonth()+1;
			return v < 10 ? '0'+v : '' + v;
		},
		//weD  : 每周第一天为周一时的当前时间所属周最后一天所在月份的二位字符值(01~12);
		'weD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 1).add(7),
				v = wd.getDate();
			return v < 10 ? '0'+v : '' + v;
		},
		//weMD : 每周第一天为周一时的当前时间所属周最后一天的以{M}-{D}形式的输出字符串
		'weMD' : function(vs, d){
			var wd = Date.getWeekFisrtDay(d, 1).add(7),
				m = wd.getMonth()+1,
				dv = wd.getDate();
				v = [];
				
			v.push(m < 10 ? '0'+m : '' + m);
			v.push(dv < 10 ? '0'+dv : '' +dv);
			return v.join('-');
		}
	}; 
	
	
	var DateFormat = function(patten){
		var me = this;
		
		//解析
		var parsePatten = function(p){
			var its = [],
				i = 0,
				len = p.length,
				s,flag = false,fn;
			
			for(;i<len;i++){
				c = p.charAt(i);
				
				if('{' === c){
					flag = true;
					if(s){
						its.push(s.join(''));
					}
					s = [];
				}
				else if('}' === c){
					if(flag){
						s = s.join('');
						fn = ValueFormats[s];
						if(isF(fn)){
							its.push(fn);
						}
						else{
							its.push('{'+s+'}');
						}
						s = undefined;
						flag = false;
					}
					else{
						s = !s ? [] : s;
						s.push(c);
					}
				}
				else{
					s = !s ? [] : s;
					s.push(c);
				}
			}
			
			if(s){
				its.push(flag ? '{'+s.join('') : s.join(''));
			}
			
			return its;
		}
		
		
		
		var	items = parsePatten(patten);
		
		//格式化
		/**
		 * @public
		 * 格式化
		 * @param {Date} date
		 * @param {Array} dateForArray
		 */
		me.format = function(date, dateForArray){
			var rel = [],
				len = items.length,
				i = 0,
				it,s;
			
			for(;i<len;i++){
				it = items[i];
				if(isF(it)){
					rel.push(it(dateForArray, date));
				}
				else if(isS(it)){
					rel.push(it);
				}
			}	
			
			return rel.join('');
		}
	
	}
	
	var DateFormats = {};


	Cmp.applyIf(Date.prototype, {
		/**
		 * @public
		 * 将当前日期转换为一个数组形式的值；格式如：[year,month,date,hour,minute,second,day]; 
		 * 其中各个属性如下：
		 * {Number} year : 年份值，如：2016。
		 * {Number} month : 月在年中的次序值，取值范围: 0~11；
		 * {Number} date : 月中日值，取值范围: 0~59
		 * {Number} hour : 小时值，取值范围: 0~23
		 * {Number} minute : 分钟值，取值范围: 0~59
		 * {Number} second : 秒值，取值范围: 0~59
		 * {Number} day : 周中日值，取值范围：0~6
		 * @return {Arrat} 
		 */
		toArrayValue : function(){
			var me = this;
			return [
				me.getFullYear(),
				me.getMonth(),
				me.getDate(),
				me.getHours(),
				me.getMinutes(),
				me.getSeconds(),
				me.getDay()
			];
		},
		/**
		 * 使用指定格式输出当前日期的值。
		 * 模板文字中采用大扩号中加入诠注字符的形式：如：{Y}-{M}-{D} 代表的就是输出2016-11-12这样的字符。
		 * 具体字符含义如下(注意大小写)：
		 * ------------- 年份 ---------------------------------------------------
		 * Y	: 年份全值，如2016年输出就是2016
		 * Ys 	: 二位的年份值，如2016年输出就是16
		 * ------------- 月份 ---------------------------------------------------
		 * M 	: 二位月份值，如一月输出为01，十二月输出为：12；
		 * Mn 	: 月份的数字值，如一月输出为1，十二月输出为：12；
		 * Mc 	: 月份长中文字符值，如一月输出为一月，十二月输出为：十二月；
		 * Mcs 	: 月份短中文字符值，如一月输出为一，十二月输出为：十二；
		 * Mcn 	: 月份中文二字符形式的字符值，如一月输出为一月，十二月输出为：十二；
		 * Me 	: 月份长英文字符值，如一月输出为January，十二月输出为：December；
		 * Mes 	: 月份短英文字符值，如一月输出为Jan，十二月输出为：Dec；
		 * Mi 	: 月份在年中的次序数值，如一月输出为0，十二月输出为：11；
		 * ------------- 日期 ---------------------------------------------------
		 * D	: 月中日的二位字符值，如1号输出为01,31号输出为31
		 * Dn	: 月中日的数字值，如1号输出为1,31号输出为31
		 * d	: 周中日英文值，如周一输出为：Monday
		 * ds	: 周中日英文缩写值，如周一输出为：Mon
		 * dc	: 周中日中文值，如周一输出为：星期一，周日输出为：星期日
		 * dcs	: 周中日缩写中文值，如周一输出为：周一，周日输出为：周日
		 * dcc	: 周中日简写中文值，如周一输出为：一，周日输出为：日
		 * ------------- 小时 ---------------------------------------------------
		 * H	: 小时的二位字符值，如0点输出为00，23点输出为23
		 * Hn	: 小时数字值输出，如0点输出为0，23点输出为23
		 * Ho	: 小时以1到24的值范围形式输出，如0点输出为24，23点输出为23，1点输出为01；
		 * Hm	: 小时以0~11的二位字符值范围形式输出，如0点输出为00，23点输出为11
		 * Hme	: 当小时之小于12时，输出AM；否则输出PM
		 * Hmc	: 当小时之小于12时，输出上午；否则输出下午
		 * Hmcm	: 当小时值为(23,0,1)时，输出"深夜”；为(2，3，4)时输出"凌晨”；为(5，6，7)时输出"早晨”；
		 *			为(8，9，10)时输出"上午”；为(11，12，13)时输出"中午”；为(14，15，16)时输出"下午”；
		 *			为(17，18，19)时输出"傍晚”；为(20，21，22)时输出"夜晚”；
		 * ------------- 分钟 ---------------------------------------------------
		 * m	: 分钟的二位字符值，如0输出为00，23输出为23
		 * mn	: 分钟的数字值输出，如0输出为0，23输出为23
		 * ------------- 秒钟 ---------------------------------------------------
		 * S	: 秒钟的二位字符值，如0输出为00，23输出为23
		 * Sn	: 秒钟的数字值输出，如0输出为0，23输出为23
		 * ------------- 周 ---------------------------------------------------
		 * W	: 年中周次序值得二位字符值(1~53)，如1输出为01，53输出为53; 且以周日为每周的第一天；
		 * WsM  : 每周第一天为周日时的当前时间所属周第一天月份的二位字符值(01~12);
		 * WsD  : 每周第一天为周日时的当前时间所属周第一天日期的二位字符值(01~31);
		 * WsMD : 每周第一天为周日时的当前时间所属周第一天的以{M}-{D}形式的输出字符串
		 * WeM  : 每周第一天为周日时的当前时间所属周最后一天所在月份的二位字符值(01~12);
		 * WeD  : 每周第一天为周日时的当前时间所属周最后一天日期的二位字符值(01~31);
		 * WeMD : 每周第一天为周日时的当前时间所属周最后一天的以{M}-{D}形式的输出字符串
		 * w	: 年中周次序值得二位字符值(1~53)，如1输出为01，53输出为53; 且以周一为每周的第一天；
		 * wsM  : 每周第一天为周一时的当前时间所属周第一天月份的二位字符值(01~12);
		 * wsD  : 每周第一天为周一时的当前时间所属周第一天日期的二位字符值(01~31);
		 * wsMD : 每周第一天为周一时的当前时间所属周第一天的以{M}-{D}形式的输出字符串
		 * weM  : 每周第一天为周一时的当前时间所属周最后一天所在月份的二位字符值(01~12);
		 * weD  : 每周第一天为周一时的当前时间所属周最后一天日期的二位字符值(01~31);
		 * weMD : 每周第一天为周一时的当前时间所属周最后一天的以{M}-{D}形式的输出字符串
		 *
		 * 下面时几种常用的格式化字符串
		 * =====================================================================
		 * 输出格式模板						输出样例
		 * ---------------------------------------------------------------------
		 * {Y}-{M}-{D}						2016-11-07
		 * {Y}-{M}-{D} {H}:{m}:{S}			2016-11-07 10:49:33
		 * {Y}-{M}-{D} {d}					2016-11-07 Monday
		 * {Y}-{M}-{D} {ds}					2016-11-07 Mon
		 * {Y}年{M}月{D}日					2016年11月07日
		 * {Y}年{M}月{D}日 {dc}				2016年11月07日 星期一
		 * {Y}年{M}月{D}日 {Hmcm}{H}时		2016年11月07日 上午10时
		 * 
		 * <p>
		 * 断定全年周次序的第一周原则为：当年1月1日为周三或之前的，那么元旦所属周为该年的第一周；否则为次周；
		 * </p>
		 * @param {String} patten 输出格式模板；默认为：{Y}-{M}-{D}
		 * @return {String} 格式化后的字符串。
		 */
		format : function (patten) {
			if(!patten){
				patten = '{Y}-{M}-{D}';
			}
			var pt = DateFormats[patten];
			if(!pt){
				pt = DateFormats[patten] = new DateFormat(patten);
			}
			var me = this;
			return pt.format(me, me.toArrayValue());
		},
		/**
		 * 返回一个新的日期对象，且返回对象的时间为当前时间的设定偏移时间值
		 * <p>
		 * 需要注意的是，如果当设定的单位类型为: year,month这两种时；如果传入的偏移量为整数那么使用自然年或自然月的形式计算；
		 * 但如果采用小数形式，则采用当前月或当前年为单位时间长度进行计算，
		 * </p>
		 *
		 * @param {Number} offset (可选)偏移量，支持小数。默认为0；如果大于0则认为是向后(未来)偏移。
		 * @param {String} unitType (可选)单位类型。支持: year,month,day,week,hour,minute,second; 默认为'day'
		 * @return {Date} 一个新的日期对象。
		 */
		add : function(offset, unitType){
			if(!isS(unitType)){
				unitType = 'day';
			}
			else{
				unitType = unitType.toLowerCase();
			}
			
			var fn = AddValue[unitType] || AddValue.day;
			return fn.call(this, isN(offset) ? offset : 0);
		}
	});
	/**
	 * 获得指定月份的天数量
	 * @param {Number} year (必须)公历年份值，如：2016
	 * @param {Number} month (必须)月份值，1月份得值等于0；12月份的值等于11； 
	 * @return {Number} 天数量；当year或month参数不正确时返回-1；
	 */
	Date.getDaysOfMonth = getDaysOfMonth;
	/**
	 * 获得指定月份第一天的周中日
	 * @param {Date/Number} year 表示月份的日期对象或者是这个月份的所属年份值
	 * @param {Number} month 月份值(0~11)
	 * @return {Number}周中日值，周日为0，周六为6；如果参数不正确则返回-1；
	 */
	Date.getDayByMonth = function(year, month){
		var d;
		if(isD(year)){
			d = new Date(year.getFullYear(), year.getMonth(),1);
			return d.getDay();
		}
		else if(isN(year) && isN(month)){
			d = new Date(year, month, 1);
			return d.getDay();
		}
		return -1;
	},
	
	/**
	 * 获得指定年份第一周的第一天
	 * 每年第一周的判断条件为：如果元旦为周循环中位于中间或更早的位置时，那么元旦所在的周为当年的第一周；否则次一周才为当年的第一周；
	 * @param {Number} year 年份值
	 * @param {Number} dayIndex 所设定每周第一天的周中日次序值；如果第一天为周日则为0，周一为1依次类推；默认为0；
	 * @return {Date} 
	 */
	Date.getFristWeekOfYear = function(year, dayIndex){
		var yearDay = new Date(year,0,1,0,0,0),
			weekday = Date.getWeekFisrtDay(yearDay, dayIndex);
		
		if(4 > (yearDay.getTime() - weekday.getTime()) / 86400000){
			//元旦所属周为该年的第一周
			return weekday;
		}	
		else{
			return weekday.add(7);
		}
	},
	/**
	 * @public
	 * 获得指定日期归属周第一天的日期
	 * @param {Date} date 指定的日期值;
	 * @param {Number} dayIndex 所设定每周第一天的周中日次序值；如果第一天为周日则为0，周一为1依次类推；默认为0；
	 * @return {Date} 
	 */
	Date.getWeekFisrtDay = function(date, dayIndex){
		if(!isD(date)){
			return undefined;
		}
		dayIndex = isN(dayIndex) ? dayIndex%7 : 0;
		var	d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
			dix = d.getDay();
		
		if(dix === dayIndex){
			return d;
		}
		else{
			var off = (dix+7 - dayIndex)%7;
			return d.add(-off);
		}
	}
}()); 
/**
 * 对于Cookie值得读取工具
 * @static Cmp.util.Cookies
 * 
 */
(function(){
	
	var Cookies = {
		/**
		 * 设定属性值
		 * @param {String} name 属性名
		 * @param {String} value 属性值
		 * @param {Date} expires 到期时间
		 * @param {String} path 设定路径
		 * @param {String} domain 作用域
		 * @param {String} secure 作用域
		 */
		set : function(name,value,expires,path,domain,secure){
        	var ral = [];
        	ral.push(name+'='+value);
        	
        	if(expires){
        		ral.push('; expires='+expires.toGMTString());
        	}
       		ral.push("; path="+(path||'/'));
        	if(domain){
        		ral.push('; domain'+domain);
        	}
        	if(secure){
        		ral.push('; secure');
        	}
        	document.cookie = ral.join('');
		},
		/**
		 * 获取指定属性的值
		 * @param {String} key 属性名
		 */
		get : function(key){
			var cs = document.cookie,
				n = key+'=',
				len = n.length,
				ix = cs.indexOf(n);
			if(ix > -1){
				var eix = cs.indexOf(';', ix);
				if(eix < 0){
					eix = cs.length;
				}
				return cs.substring(ix+len, eix);
			}
			return undefined;
		},
		/**
		 * 清除指定的属性
		 */
		clear : function(name){
			if(Cookies.get(name)){
				document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT';
			}
		}
	};
	
	Cmp.util.Cookies = Cookies;
}());
/**
 * 值转换工具
 * @static Cmp.util.ValueHelper
 */
(function(){
	var PK = Cmp.util;
	
	var cloneArray = function(arr, path){
		var i=0,len = arr.length,v,na = [];
		for(;i<len;i++){
			v = arr[i];
			if(path.indexOf(v) < 0){
				if(isO(v)){
					if(isA(v)){
						ps = path.slice(0);
						ps.push(arr);
						v = cloneArray(v, ps);
					}
					else{
						ps = path.slice(0);
						ps.push(arr);
						v = cloneObject(v, ps);
					}
				} 
				na.push(v);
			}
		}
		return na;
	}
	
	var cloneObject = function(obj, path){
		var i,v,o = {},ps;
		for(i in obj){
			v = obj[i];
			if(path.indexOf(v) < 0){
				//执行path.indexOf(v)< 0 是为了防止复制的对象，是父；
				if(isO(v)){
					if(isA(v)){
						ps = path.slice(0);
						ps.push(obj);
						v = cloneArray(v, ps);
					}
					else{
						ps = path.slice(0);
						ps.push(obj);
						v = cloneObject(v, ps);
					}
				}
				o[i] = v;
			}
		}
		return o;
	} 
	
	var parseDate = function(s, def){
		var ix,t,
			y,m,d,h,mi,se;
		
		//年
		ix = s.indexOf('-');
		if(ix > -1){
			y = s.substring(0, ix);
			y = parseInt(y);
		}
		else{
			y = parseInt(s);
		}
		
		if(!isN(y) || NaN == y || Infinity == y){
			return def; 
		}
		else{
			//有年份之后就可以继续解析其他值了
			m = 0,d = 1,h = 0,mi=0,se = 0;
		}
		if(ix < 0){
			return new Date(y,m,d,h,mi,se); 
		}
		
		//月份
		s = s.substring(ix+1);
		ix = s.indexOf('-');
		if(ix > -1){
			t = s.substring(0, ix);
			t = parseInt(t);
		}
		else{
			t = parseInt(s);
		}
		if(!isN(t) || NaN == t || Infinity == t){
			return new Date(y,m,d,h,mi,se); 
		}
		else{
			m = t-1;
		}
		if(ix < 0){
			return new Date(y,m,d,h,mi,se); 
		}
		
		//天
		t = undefined;
		s = s.substring(ix+1);
		ix = s.indexOf(' ');
		if(ix > -1){
			t = s.substring(0, ix);
			t = parseInt(t);
		}
		else{
			t = parseInt(s);
		}
		if(!isN(t) || NaN == t || Infinity == t){
			return new Date(y,m,d,h,mi,se); 
		}
		else{
			d = t;
		}
		
		if(ix < 0){
			return new Date(y,m,d,h,mi,se); 
		}
		
		s = s.substring(ix+1).trim();
		//是否还需要继续解析
		if(!s){
			return new Date(y,m,d,h,mi,se); 
		}
		
		//时
		t = undefined;
		ix = s.indexOf(':');
		if(ix > -1){
			t = s.substring(0, ix);
			t = parseInt(t);
		}
		if(!isN(t) || NaN == t || Infinity == t){
			return new Date(y,m,d,h,mi,se); 
		}
		else{
			h = t;
		}
		
		//分
		t = undefined;
		s = s.substring(ix+1);
		ix = s.indexOf(':');
		if(ix > -1){
			t = s.substring(0, ix);
			t = parseInt(t);
		}
		if(!isN(t) || NaN == t || Infinity == t){
			return new Date(y,m,d,h,mi,se); 
		}
		else{
			mi = t;
		}
		
		//秒
		t = undefined;
		s = s.substring(ix+1);
		ix = s.indexOf('.');
		if(ix > -1){
			t = s.substring(0, ix);
			t = parseInt(t);
		}
		else{
			t = s ? parseInt(s) : undefined;
		}
		
		if(!isN(t) || NaN == t || Infinity == t){
			return new Date(y,m,d,h,mi,se); 
		}
		else{
			se = t;
		}
		return new Date(y,m,d,h,mi,se); 
	}
	
	var Rel = {
		/**
		 * 深度复制指定的对象；
		 * <p>
		 * 因为对于Cmp.apply来说，只是浅层次的复制，所以这里提供一个深层次的复制；可以复制的属性包括：
		 * 1> 基本数据，包括：数字，字符串，时间，布尔，方法,以及undefined和null;
		 * 2> 数据结构对象，包括：数组，对象。
		 * 当复制的属性是一个复杂数据结构对象时，将递归调用该方法。
		 * @param {Object} obj 指定的对象；
		 * @return {Obejct} 新的对象；如果传入对象只是一个基本数据，则直接返回这个对象。
		 */
		clone : function(obj){
			if(isA(obj)){
				return cloneArray(obj, []);
			}
			else if(isO(obj)){
				return cloneObject(obj, []);
			}
			else{
				return obj;
			}
		},
		/**
		 * 将指定值转换为一个字符串,如果无法转换则返回默认值。
		 * <p>
		 * 转换策略如下，按照优先级次序排列：
		 * <li> 1> 如果传入值为null或undefiend，那么返回默认值。
		 * <li> 2> 如果传入值为一个字符串，则返回这个值。
		 * <li> 3> 如果传入值为一个数值，则返回字符串化后的该数值。
		 * <li> 4> 如果传入值为一个boolean值，则返回'false'或'true';
		 * <li> 5> 如果传入值为一个Date类型值，则返回格式为'yyyy-mm-dd 24hh:mi:ss' 这种格式的字符串。如：'2015-09-06 15:55:59';
		 * <li> 6> 返回调用该对象的toString()方法的返回值。
		 * 
		 * @param {Mixed} value 待转换的值
		 * @param {String} defaultValue 默认值
		 * @return {Number} 按照策略解析后的值。
		 */
		toString : function(value, defaultValue){
			if(undefined === value || null === value){
				return defaultValue;
			}
			if(isS(value)){
				return value;
			}
			if(isN(value)){
				return '' + value;
			}
			if(isB(value)){
				return value ? 'true' : 'false';
			}
			if(isD(value)){
				return value.format();
			}
			
			return value.toString();
		},
		/**
		 * 将指定值转换为一个整数，如果无法转换则返回默认值。
		 * <p>
		 * 转换策略如下，按照优先级次序排列：
		 * <li> 1> 如果传入值为数值但等于Nan，那么返回默认值。
		 * <li> 2> 传入值为一个整数，直接返回该值；
		 * <li> 3> 传入值为一个浮点数，返回这个浮点数值四舍五入后的值；
		 * <li> 4> 传入值为一个字符串，解析这个字符串为数值；然后按照1，2，3的策略返回这个数值。如果无法解析，则返回默认值。
		 * <li> 5> 传入值为一个Boolean值，那么当等于true的时候返回1，false返回0；
		 * <li> 6> 传入值为一个Date类型值，那么返回Date#getTime()的值
		 * <li> 7> 其他类型值一律返回默认值。
		 *
		 * @param {Mixed} value 需要转换的值
		 * @param {Number} defaultValue 默认值
		 * @return {Number} 按照策略解析后的值。
		 */
		toInteger : function(value, defaultValue){
			if(undefined === value || null === value){
				return defaultValue;
			}
			if(isN(value)){
				//数值类型
				if(NaN === value){
					return defaultValue;
				}
				return Math.round(value);
			}
			else if(isS(value)){
				value = parseFloat(value);
				return Rel.toInteger(value, defaultValue);
			}
			else if(isB(value)){
				return value ? 1 : 0;
			}
			else if(isD(value)){
				return value.getTime();
			}
			else{
				return defaultValue;
			}
		},
		/**
		 * 将指定值转换为一个浮点数，如果无法转换则返回默认值。
		 * <p>
		 * 转换策略如下，按照优先级次序排列：
		 * <li> 1> 如果传入值为数值但等于Nan，那么返回默认值。
		 * <li> 2> 传入值为一个数值，直接返回该数值；
		 * <li> 3> 传入值为一个字符串，解析这个字符串为数值；然后按照1，2的策略返回这个数值。如果无法解析，则返回默认值。
		 * <li> 4> 其他类型值一律返回默认值。
		 * 
		 * @param {Mixed} value 待转换的值
		 * @param {String} defaultValue 默认值
		 * @return {Number} 按照策略解析后的值。
		 */
		toFloat : function(value, defaultValue){
			if(undefined === value || null === value){
				return defaultValue;
			}
			if(isN(value)){
				//数值类型
				if(NaN === value){
					return defaultValue;
				}
				return value;
			}
			else if(isS(value)){
				value = parseFloat(value);
				return Rel.toFloat(value, defaultValue);
			}
			else if(isB(value)){
				return value ? 1 : 0;
			}
			else if(isD(value)){
				return value.getTime();
			}
			else{
				return defaultValue;
			}
		},
		/**
		 * 将指定值转换为一个布尔值，如果无法转换则返回默认值。
		 * <p>
		 * 转换策略如下，按照优先级次序排列：
		 * <li> 1> 如果传入值为null或undefiend，那么返回默认值。
		 * <li> 2> 如果传入值为一个Boolean类型值，那么直接返回该值
		 * <li> 3> 如果传入值为一个字符串,则再进性trim和toLowerCase操作后，这个字符串除了等于''和'false'以外，其他值都返回true。
		 * <li> 4> 如果传入值为一个数值，则当大于0时返回true，其他值返回false。
		 * <li> 5> 其他类型值则先进行toString操作获得字符串之后，按照策略3的方式返回值。
		 * 
		 * @param {Mixed} value 待转换的值
		 * @param {String} defaultValue 默认值
		 * @return {Number} 按照策略解析后的值。
		 */
		toBoolean : function(value, defaultValue){
			if(value === undefined 
				|| value === null){
				return defaultValue;
			}
			if(isB(value)){
				return value;
			}
			if(isS(value)){
				return 'true' === value.trim().toLowerCase();
			}
			if(isN(value)){
				return value > 0;
			}
			return Rel.toBoolean(value.toString());
		},
		/**
		 * 将制定的值转换为一个日期类型值
		 * 转换策略如下，按照优先级次序排列：
		 * <li> 1> 如果传入值为null或undefiend，那么返回默认值。
		 * <li> 2> 如果传入值为一个Boolean类型值，且它的值等于true则返回当前时间，否则返回默认值。
		 * <li> 3> 如果传入值为Date类型对象，那么直接返回该值。
		 * <li> 4> 如果传入为一个字符串，则按照'YYYY-MM-DD[ HH:MI:SS]'的格式进行解析；其中HH:MI:SS为可选项；当没有设定时认为值是：00:00:00。当无法解析时返回默认值。
		 * <li> 5> 如果传入的为一个数值，则认为设定时间到1970-01-01 00:00:00的毫秒数。
		 * 
		 * @param {Mixed} value 待转换的值
		 * @param {String} defaultValue 默认值
		 * @return {Date} 按照策略解析后的值。
		 */
		toDate : function(value, defaultValue){
			if(value === undefined 
				|| value === null){
				return defaultValue;
			}
			if(isD(value)){
				return value;
			}
			else if(isB(value)){
				return value ? new Date() : defaultValue;
			}
			else if(isN(value)){
				return new Date(value);
			}
			else if(isS(value)){
				return parseDate(value, defaultValue);
			}
			else{
				return defaultValue;
			}
		},
		/**
		 * 对两个值进行比较；当第一个值大于第二个值时，返回大于0的值；当第二个值小于第一个值得时候返回小于0的值;
		 * 如果连个值完全相等，则返回0；
		 * <p>
		 * 对于值类型有如下规则：
		 * 1> 对于null和undeined来说，小于任何一个实例值。而这两个值则认为它们是相等的。
		 * 2> 如果两个值得值类型相等，则使用与之对应的比较方法，这种值类型包括：Number,Boolean,Date,String,Function,Array; 具体规则大致如下
		 * 2.1 > Number: 纯数字比较，小学生都知道怎么比较。
		 * 2.2 > Date : 时间早的小于时间晚的；
		 * 2.3 > Boolean : false 小于true 
		 * 2.4 > String : 将字符串的字符转为小写，然后各个字符进行比较，其规则为: 符号 < 数字(0~9) < 字母(a~z)的 
		 * 2.5 > Function : 调用其方法，并根据返回的值再进行比较。
		 * 2.6 > Array : 按照顺序，依次比较；直道某一项不相等并返回比较值。 
		 * 3 > 如果两者的值类型不一致，则将其转换为字符串，再进行比较。 
		 * 
		 * @param {Mixed} o1 值1
		 * @param {Mixed} o2 值2
		 * @return {Number} 比较结果。
		 */
		compare : function(o1, o2){
			
			var v1 = o1 = null === o1 ? undefined : (isF(o1) ? o1() : o1),
				v2 = o2 = null === o2 ? undefined : (isF(o2) ? o2() : o2);
			
			if(v1 === v2){
				return 0;
			}	
			
			
			if(isN(v1) && isN(v2)){
				return Rel.compareNumber(v1, v2);
			}
			else if(isD(v1) && isD(v2)){
				return Rel.compareDate(v1, v2);
			}
			else if(isB(v1) && isB(v2)){
				return Rel.compareBoolean(v1, v2);
			}
			else if(isA(v1) && isA(v2)){
				return Rel.compareArray(v1, v2);
			}
			else if(isO(v1) && isO(v2)){
				v1 = v1.valueOf();
				v2 = v2.valueOf();
				return Rel.compare(v1, v2);
			}
			else{
				return Rel.compareString(v1, v2);
			}
			
		},
		/**
		 * 比较两个字符串的值，如果两者相等则返回0，如果s1应该排列在s2前则返回-1；如果s1应该排列在s2后则返回1。
		 * <p>
		 * undefined或者null这两个值在字符串比较时是最小的，
		 * 
		 * @param {String} s1 字符串1
		 * @param {String} s2 字符串2
		 * @return {Number} 比较结果。
		 */
		compareString : function(s1, s2){
			if(s1 == s2){
				return 0;
			}
			if(s1 == null){
				return -1;
			}
			if(s2 == null){
				return 1;
			}
			s1 = isS(s1) ? s1 : s1.toString();
			s2 = isS(s2) ? s2 : s2.toString();
			s1 = s1.toLowerCase();
			s2 = s2.toLowerCase();
			return s1 == s2 ? 0 : (s1 > s2 ? 1 : -1);
		},
		/**
		 * 对两个数值进行比较；如果v1值小于v2则返回-1；大于则返回1，相等则返回0；
		 * undefined或者null这两个值要小于任何一个数值。NaN值要大于任何一个数值；
		 * 
		 * @param {Number} v1 数值1
		 * @param {Number} v2 数值2
		 * @return {Number} 比较结果。
		 */
		compareNumber : function(v1,v2){
			if(v1 == v2){
				return 0;
			}
			if(isNaN(v1)){
				return 1;
			}
			if(isNaN(v2)){
				return -1;
			}
			
			if(!isN(v1) || !isN(v2)){
				return Rel.compareString(v1, v2);
			}
			
			
			return v1 > v2 ? 1 : -1;
		},
		/**
		 * 对两个时间值进行比较, 如果v1的时间值早于v2，则返回-1；如果晚于v2则返回1；如果相等则返回0；
		 * undefined或者null这两个值要早于任何一个时间值。
		 * @param {Date} v1 日期1
		 * @param {Date} v2 日期2
		 * @return {Number} 比较结果。
		 */
		compareDate : function(v1, v2){
			if(v1 == v2){
				return 0;
			}
			if(!isD(v1) || !isD(v2)){
				return Rel.compareString(v1, v2);
			}
			v1 = v1.getTime();
			v2 = v2.getTime();
			return v1 == v2 ? 0 : (v1 > v2 ? 1 : -1);
		},
		/**
		 * 对两个布尔值进行比较，如果v1等于v2，则返回0；如果v1为false则返回-1，否则返回1;
		 * undefined或者null这两个值一律视为false。
		 * @param {Boolean} v1 布尔值1
		 * @param {Boolean} v2 布尔值2
		 * @return {Number} 比较结果。
		 */
		compareBoolean : function(v1, v2){
			v1 = !!v1;
			v2 = !!v2;
			if(v1 == v2){
				return 0;
			}
			
			return v1 ? 1 : -1;
		},
		/**
		 * 比较两个方法的返回值。如果方法1的返回值等于方法2，则返回0，如果方法1的大于方法2，则返回1；
		 *
		 * @param {Function} f1 方法1
		 * @param {Function} f2 方法2
		 * @return {Number} 比较结果。
		 */
		compareFunction : function(f1, f2){
			if(f1 === f2){
				return 0;
			}
			var v1 = isF(f1) ? f1() : f1;
			var v2 = isF(f2) ? f2() : f2;
			return Rel.compare(v1, v2);
		},
		/**
		 * 比较两个数组；
		 * <p>
		 * 便利两个数组的项，依次比较；如果相等则比较下一项；如果不相等，则返回结果。
		 * 
		 * @param {Array} a1 数组1
		 * @param {Array} a2 数组2
		 * @return {Number} 比较结果。
		 */
		compareArray : function(a1, a2){
			if(a1 == a2){
				return 0;
			}
			if(!isA(a1) || !isA(a2)){
				return Rel.compareString(a1+'', a2+'');
			}
			
			var i=0,
				len = a1.length > a2.length ? a2.length : a1.length,
				c;
			
			for(;i<len;i++){
				c = Rel.compare(a1[i], a2[i]);
				if(c != 0){
					return c;
				}
			}
			return 	a1.length == a2.length ? 0 : (a1.length > a2.length ? 1 : -1);
		}
	};
	Cmp.util.ValueHelper = Rel;
}());
/**
 * Dom操作基础工具静态类。
 * @static Cmp.util.DomHelper
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){
	var UV = Cmp.util.ValueHelper,
		camelRe = /(-[a-z])/gi,
		spacesRe = /\s+/,
		trimRe = /^\s+|\s+$/g,
		opacityRe = /alpha\(opacity=(.*)\)/i,
		camelRe = /(-[a-z])/gi,
        MOUSEOVER = 'mouseover',
        MOUSEOUT = 'mouseout',
        view = document.defaultView,
		propCache = {},
		DH;
	//@private
	function camelFn(m, a) {
        return a.charAt(1).toUpperCase();
    }
	//@private
	function chkCache(prop) {
        return propCache[prop] || (propCache[prop] = prop == 'float' ? ('float') : prop.replace(camelRe, camelFn));
    }
	
	function checkRelatedTarget(e) {
        return !elContains(e.currentTarget, DH.getRelatedTarget(e));
    }

    function elContains(parent, child) {
       if(parent && parent.firstChild){
         while(child) {
            if(child === parent) {
                return true;
            }
            child = child.parentNode;
            if(child && (child.nodeType != 1)) {
                child = null;
            }
          }
        }
        return false;
    }
		
	DH = {
		/**
		 * 创建一个Dom对象，并根据设定配置它们
		 * 
		 * @config {String} tag 所创建Dom对象的标签名。
		 * @config {String} id 所创建Dom对象的ID值
		 * @config {String/Array} cls 所创建Dom对象的CSS样式设定
		 * @config {Object} style 所创建Dom对象的style属性设定
		 * @config {Object} atts 所创建Dom对象的其他属性设定，不包括：id,style,class,className这些属性。
		 * @config {HTMLElement} parentNode 所创建对象的父对象，如果设定，则将新创建Dom对象追加到这个Dom对象的字对象集合的队尾。
		 * @config {HTMLElement} insertNode 所创建对象的兄弟对象；如果设定，则将创建Dom对象添加到这个对象之前(insertBefore)。当设定了parentNode属性时，该配置无效。
		 * @config {String} html 所新建对象的innerHTML设定。
		 * 
		 * @param {Object} config (必须)配置数据对象，具体配置属性参考@config注释
		 * @return {HTMLElement} 新建对象
		 */
		createDom : function(config){
			if(!isO(config)){
				return undefined;
			}
			var dom = document.createElement(config.tag || 'div'),
				v;
			if(isS(config.id)){
				dom.id = config.id;
			}
			if(config.cls){
				v = isA(config.cls) ? config.cls.join(' ') : 
							(isS(config.cls) ? config.cls : false);
				if(v){
					dom.className = v;
				}
			}
			if(config.style){
				DH.setStyle(dom, config.style);
			}
			if(config.atts){
				DH.setAttribute(dom, config.atts);
			}
			if(config.parentNode && isF(config.parentNode.appendChild)){
				config.parentNode.appendChild(dom);
			}
			if(config.insertNode && config.insertNode.parentNode){
				var p = config.insertNode.parentNode;
				if(isF(p.insertBefore)){
					p.insertBefore(dom, config.insertNode);
				}
			}
			if(isS(config.html)){
				dom.innerHTML = config.html;
			}
			return dom;
		}, 
		/**
		 * 在指定Dom上添加一个事件
		 */
		addEvent : function(){
			var ret;
			
			if (window.addEventListener) {
				ret = function(el, eventName, fn, capture) {
					if (eventName == 'mouseenter') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener(MOUSEOVER, fn, (capture));
                    } else if (eventName == 'mouseleave') {
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener(MOUSEOUT, fn, (capture));
                    } else {
                        el.addEventListener(eventName, fn, (capture));
                    }
                    return fn;
				}
			}
			else if (window.attachEvent) {
				ret = function(el, eventName, fn, capture) {
                    el.attachEvent('on' + eventName, fn);
                    return fn;
                };
			}
			else {
                ret = function(){};
            }
			
			return ret;
		}(),
		/**
		 * 在指定的Dom上删除一个事件
		 */
		removeEvent : function(){
			var ret;
            if (window.removeEventListener) {
                ret = function (el, eventName, fn, capture) {
                    if (eventName == 'mouseenter') {
                        eventName = MOUSEOVER;
                    } else if (eventName == 'mouseleave') {
                        eventName = MOUSEOUT;
                    }
                    el.removeEventListener(eventName, fn, (capture));
                };
            } else if (window.detachEvent) {
                ret = function (el, eventName, fn) {
                    el.detachEvent("on" + eventName, fn);
                };
            } else {
                ret = function(){};
            }
            return ret;
		}(),
		/**
		 * 断定指定Dom对象是否具备指定的样式名。
		 */
		hasClass : function(dom, cls){
			if(!isS(cls)){
				return false;
			}
			var classes = DH.getClass(dom);
			return classes.indexOf(cls) > -1;
		},
		/**
		 * 获取指定Dom设定的样式名
		 */
		getClass : function(dom){
			if(!dom){
				return [];
			}
			var cls = dom.className.replace(trimRe, '');
			if(!cls){
				return [];
			}
			cls = cls.split(spacesRe);
			return cls;
		},
		/**
		 * 为指定的Dom添加样式
		 */
		addClass : function(dom, cls){
			if(!dom){
				return ;
			}
			var meCls = DH.getClass(dom),
				c, cs = false;
				
			cls = isA(cls) ? cls : [cls];
			for(var i=0, len = cls.length; i<len;i++){
				c = cls[i];
				if(isS(c) && meCls.indexOf(c) < 0) {
					meCls.push(c);
					cs = true;
				}
			}
			if(cs){
				dom.className = meCls.join(' ');
			}
		},
		/**
		 * 设定Dom的样式
		 */
		setClass : function(dom, cls){
			if(!dom){
				return ;
			}
			
			if(isS(cls)){
				dom.className = cls;
			}
			else if(isA(cls)){
				var i=0, len = cls.length,
					c,cs = [];
				for(; i<len;i++){
					c = cls[i];
					if(isS(c) && cs.indexOf(c) < 0) {
						cs.push(c);
					}
				}
				dom.className = cs.join(' ');
			}
			else{
				dom.className = '';
			}
			
		},
		/**
		 * 删除指定Dom节点设定的样式
		 */
		removeClass : function(dom, cls){
			var meCls = DH.getClass(dom),
				c,ii;
			if(meCls.length == 0){
				return ;
			}
			cls = isA(cls) ? cls : [cls];
			for (var i = 0, len = cls.length; i < len; i++) {
				c = cls[i];
				if(isS(c)){
					c = c.replace(trimRe, '');
					ii = meCls.indexOf(c);
					if(ii > -1){
						 meCls.splice(ii, 1);
					}
				}
			}
			
			dom.className = meCls.join(' ');
		},
		/**
		 * 获得指定Dom当前的显示属性
		 * 该属性值为原生的配置属性。
		 */
		getStyle : function(dom, styleName){
			if(!isE(dom) || !styleName || !dom.style){
				return undefined;
			}
			var n = chkCache(styleName);
			if(!n){
				return undefined;
			}
			var v = dom.style[n];
			
			if(!v){
				if(view && isF(view.getComputedStyle)){
					var cs = view.getComputedStyle(dom, '');
					v = cs ? cs[n] : undefined;
				}
				else if(dom.currentStyle){
					v = dom.currentStyle[n];
				}
			}
			
			return v;
		},
		/**
		 * 获得指定Dom配置样式的设定数值；所获取的配置样式都是可以分析为像素值得；如：left,top等。
		 * @param {HTMLElement} dom 
		 * @param {String} name 样式名 
		 */
		getStyleNumber : function(dom, name){
			var v = DH.getStyle(dom, name);
			var ind = v ? v.indexOf('px') : -1;
			if(ind > 0){
				return UV.toFloat(v.substring(0, ind));
			}
			return 0;
		},
		/**
		 * 断定Dom配置的样式属性是否为指定的值
		 * @param {HTMLElement} dom 
		 * @param {String} key 显示属性名；
		 * @param {Object} value 设定值
		 */
		isStyle : function(dom, key, value){
			return DH.getStyle(dom, key) === value;
		},
		/**
		 * 获得指定Dom对象上下滚动条的位置
		 */
		getScrollTop : function(dom){
			return isE(dom) ? (dom.scrollTop || 0) : 0;
		},
		/**
		 * 获得指定Dom对象左右滚动条的位置
		 */
		getScrollLeft : function(dom){
			return isE(dom) ? (dom.scrollLeft || 0) : 0;
		},
		/**
		 * 设置指定Dom的显示属性，此处为原生形式
		 * @param {HTMLElement} dom 
		 * @param {Obejct/String} key 以名值对形势构建的多个显示属性配置或者是显示属性名；
		 * @param {Object} value 设定值；当key为一个对象时，该设定无效。
		 */
		setStyle : function(dom, key, value){
			if(!dom){
	    		return ;
	    	}
			if (!isO(key)){
				var tmp = {};
				tmp[key] = value;
				key = tmp;
			}
			var n,v;
			for (n in key) {
				v = key[n];
				dom.style[chkCache(n)] = v;
			}
		},
		/**
	     * 设定所控制Dom的属性，但是不能设定'id','style','className'这三个属性。
	     */
		setAttribute : function(dom, key, value){
			if(!dom){
	    		return ;
	    	}
	    	if(isO(key)){
	    		for(var i in key){
	    			DH.setAttribute(dom, i, key[i]);
	    		}
	    	}
	    	else if(isS(key) 
				&& key !== 'id'
				&& key !== 'style'
				&& key !== 'className'){
				dom.setAttribute(key, value);	
			}
		},
		/**
		 * 获得指定属性的值
		 *
		 * @param {HTMLElement} dom
		 * @param {String/Array} key
		 */
		getAttribute : function(dom, key){
			if(!dom){
	    		return undefined;
	    	}
	    	if(isS(key)){
	    		return dom.getAttribute(key);
	    	}
	    	if(isA(key)){
	    		var i=0,len= key.length,k,o = {};
	    		for(;i<len;i++){
	    			k = key[i];
	    			o[k] = dom.getAttribute(k);
	    		}
	    		return o;
	    	}
		},
		/**
		 * 删除指定的属性
		 * @param {HTMLElement} dom
		 * @param {String/Array} key
		 */
		removeAttribute : function(dom, key){
			if(!dom || !isF(dom.removeAttribute)){
	    		return ;
	    	}
	    	if(isS(key)){
	    		return dom.removeAttribute(key);
	    	}
	    	else if(isA(key)){
	    		var i=0,len = key.length,k;
	    		for(;i<len;i++){
	    			k = key[i];
	    			dom.removeAttribute(k);
	    		}
	    	}
		},
		/**
		 * 获得指定Dom的宽度，这个宽度包括：内容宽度+边框宽度+左右内边距
		 */
		getWidth : function(dom){
			if(!isE(dom)){
				return 0;
			}
			return dom.offsetWidth;
		},
		/**
		 * 设定指定Dom的宽度
		 * @param {HTMLElement} dom
		 * @param {String/Number} w 设定的宽度；当为一个数字时，表示是像素值，字符串则是配置值
		 * @return {Number} Dom设定后的宽度值，包括：内容宽度+边框宽度+左右内边距
		 */
		setWidth : function(dom, w){
			if(!isE(dom)){
				return 0;
			}
			if(isN(w)){
				w = w +'px';
			}
			if(isS(w)){
				DH.setStyle(dom, 'width', w);
			}
			
			return dom.offsetWidth;
		},
		/**
		 * 获得指定Dom的高度，这个高度包括：内容高度+边框宽度+上下内边距
		 */
		getHeight : function(dom){
			if(!isE(dom)){
				return 0;
			}
			return dom.offsetHeight;
		},
		/**
		 * 设定指定Dom的高度
		 * @param {HTMLElement} dom
		 * @param {String/Number} h 设定的高度；当为一个数字时，表示是像素值，字符串则是配置值
		 * @return {Number} Dom设定后的高度值，包括：内容高度+边框宽度+上下内边距
		 */
		setHeight : function(dom, h){
			if(!isE(dom)){
				return 0;
			}
			if(isN(h)){
				h = h+'px';
			}
			if(isS(h)){
				DH.setStyle(dom, 'height', h);
			}
			return dom.offsetHeight;
		},
		/**
		 * 将指定的Dom对象，从他的父对象上删除。
		 * @param {HTMLElement} dom Dom对象。
		 * @return {Boolean} 返回true表示该Dom被成功删除。
		 */
		remove : function(dom){
			if('BODY' !== dom.tagName
				&& 'HEAD' !== dom.tagName
				&& 'HTML' !== dom.tagName){
				dom.parentNode.removeChild(dom);
				return true;
			}
			return false;
		},
		/**
		 * 获得指定Dom对象，在整个浏览器窗口的像素级位置
		 *
		 * @return {Array} 格式如：[x,y]的数据，xy[0]为横坐标，xy[1]为纵坐标
		 */
		getXY : function(dom){
			if(!isE(dom)){
				return [0,0];
			}
			var d = dom,
				hasAbs,
				x,y,v;
			
			if('BODY' === d.tagName){
				return [0,0];
			}
			if(isF(dom.getBoundingClientRect)){
				v = dom.getBoundingClientRect();
				return [v.left, v.top];
			}
			x = d.offsetLeft;
			y = d.offsetTop;
			hasAb = DH.isStyle(d, 'position', 'absolute');
			d = d.parentNode;
			
			while(d && 'BODY' !== d.tagName){
				x += d.offsetLeft;
				y += d.offsetTop;
				//断定是否为绝对路径的
				hasAb = hasAb || DH.isStyle(d, 'position', 'absolute');
				
				//边框宽度
				x += DH.getStyleNumber(d, 'borderLeftWidth') || 0;
				y += DH.getStyleNumber(d, 'borderTopWidth') || 0;
				
				
				//滚动条位置
				x -= DH.getScrollLeft(d) || 0;
				y -= DH.getScrollTop(d) || 0;
				
				d = d.offsetParent;
			}
			if(hasAb) {
				d = document.body;
           		x -= d.offsetLeft;
           		y -= d.offsetTop;
           	}
           	
			return [x,y];
		
		},
		getRelatedTarget : function(ev) {
            ev = ev.browserEvent || ev;
            return this.resolveTextNode(ev.relatedTarget ||
                (/(mouseout|mouseleave)/.test(ev.type) ? ev.toElement :
                 /(mouseover|mouseenter)/.test(ev.type) ? ev.fromElement : null));
        },
		resolveTextNode : Cmp.isGecko ? function(node){
            if(!node){
                return;
            }
            // work around firefox bug, https://bugzilla.mozilla.org/show_bug.cgi?id=101197
            var s = HTMLElement.prototype.toString.call(node);
            if(s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]'){
                return;
            }
            return node.nodeType == 3 ? node.parentNode : node;
        } : function(node){
            return node && node.nodeType == 3 ? node.parentNode : node;
        }
	}
	DH.on = DH.addEvent;
	DH.un = DH.removeEvent;
	
	Cmp.util.DomHelper = DH;
}());
/**
 * 事件收发代理器
 * @class Cmp.util.EventProxy
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){
	var PK = Cmp.util;
	PK.EventProxy = function(){
		var me = this,
			listeners = [];
		
		/**
		 * @private
		 */
		var doFire = function(args){
			var ls = listeners.slice(0),
				len = ls.length,
				l,rel = false;
			while(len--){
				l = ls[len];
				if(false === l.fn.apply(l.scope || {}, args)){
					rel = true;
				}
			}
			return rel;
		}
		/**
		 * @private
		 */
		var findListener = function(fn, scope){
			var ls = listeners.slice(0),
				len = ls.length,l;
			while(len--){
				l = ls[len];
				if(l.fn === fn && l.scope === scope){
					return len;
				}
			}	
			return -1;
		}
		
		/**
		 * 添加一个事件监听
		 */
		me.addListener = function(fn, scope, op){
			if(isF(fn) && findListener(fn, scope) < 0){
				listeners.push({
					fn : fn,
					scope : scope
				});
			}
		}
		/**
		 * 删除一个事件监听
		 */
		me.removeListener = function(fn, scope){
			var ii = findListener(fn, scope);
			if(ii > -1){
				listeners.splice(ii, 1);
			}
		}
		/**
		 * 清空所有监听方法
		 */
		me.clear = function(){
			listeners = [];
		}
		/**
		 * 销毁
		 */
		me.destory = function(){
			listeners = undefined;
		}
		/**
		 * 分发事件
		 */
		me.fire = function(){
			return doFire(arguments);
		}
	}
}());
/**
 * 当前浏览器窗口(Window)及文档(Domcument)信息读取类。
 * 
 * @static Cmp.util.DocHelper
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){
	var PK = Cmp.util,
		DH = PK.DomHelper,
		DOC = document,
		docMode = DOC.documentMode,
		ua = navigator.userAgent.toLowerCase(),
		check = function(r){
            return r.test(ua);
        },
        docReadyEvent,
        docReadyPrimacy;

	Cmp.isStrict = DOC.compatMode == "CSS1Compat";
	Cmp.isOpera = check(/opera/);
	Cmp.isChrome = check(/\bchrome\b/);
	Cmp.isFireFox = check(/firefox/);
	Cmp.isWebKit = check(/webkit/);
	Cmp.isSafari = !Cmp.isChrome && check(/safari/);
	Cmp.isGecko = !Cmp.isWebKit && check(/gecko/),
	Cmp.isIE = !Cmp.isOpera && check(/msie/);
	
	
	var DETECT_NATIVE = Cmp.isGecko || Cmp.isWebKit || Cmp.isSafari,
		DOC = document,
		DOMCONTENTLOADED = "DOMContentLoaded",
		COMPLETE = 'complete',
		docReadyState = false,
		docReadyProcId;
		
		
	var queryStyles = function(){
		var styles = document.getElementsByTagName('style');
		return styles;
	}
	var initDocReady = function(){
		docReadyPrimacy || (docReadyPrimacy = new PK.EventProxy())
		docReadyEvent || (docReadyEvent = new PK.EventProxy());
		if(DETECT_NATIVE){
			DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
		}
		if (Cmp.isIE){
			if(!checkReadyState()){
                checkReadyState.bindIE = true;
                DOC.attachEvent('onreadystatechange', checkReadyState);
            }
		}
		else if(Cmp.isOpera ){
			(DOC.readyState == COMPLETE && checkStyleSheets()) ||
                DOC.addEventListener(DOMCONTENTLOADED, OperaDOMContentLoaded, false);
		}
		else if (Cmp.isWebKit){
            //Fallback for older Webkits without DOMCONTENTLOADED support
            checkReadyState();
        }
        DH.on(window, "load", fireDocReady);
	}
	function OperaDOMContentLoaded(e){
        DOC.removeEventListener(DOMCONTENTLOADED, arguments.callee, false);
        checkStyleSheets();
    }
    function checkStyleSheets(e){
        styles || (styles = queryStyles());
        if(styles.length == DOC.styleSheets.length){
            fireDocReady();
            return true;
        }
        docReadyState || (docReadyProcId = setTimeout(arguments.callee, 2));
        return false;
    }
	
	var checkReadyState = function(e){
        if(Cmp.isIE && doScrollChk()){
            return true;
        }
        if(DOC.readyState == COMPLETE){
            fireDocReady();
            return true;
        }
        docReadyState || (docReadyProcId = setTimeout(arguments.callee, 2));
        return false;
    }
    var doScrollChk = function(){
        if(window != top){
            return false;
        }

        try{
            DOC.documentElement.doScroll('left');
        }catch(e){
             return false;
        }

        fireDocReady();
        return true;
    }    
    var fireDocReady = function(){
    	if(!docReadyState){
    		docReadyState = true;
    		
    		if(docReadyProcId){
                clearTimeout(docReadyProcId);
            }
            
            if(DETECT_NATIVE) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Cmp.isIE && checkReadyState.bindIE){  //was this was actually set ??
                DOC.detachEvent('onreadystatechange', checkReadyState);
            }
            DH.un(window, "load", arguments.callee);
    	}
    	
    	if(docReadyEvent && !Rel.isReady){
            Rel.isReady = true;
            docReadyPrimacy.fire();
            docReadyPrimacy.clear();
            docReadyEvent.fire();
            docReadyEvent.clear();
        }
    }
    
	var Rel = {
		isReady : false,
		/**
		 * 当文档资源下载完毕后，调用传入的回调方法
		 */
		onReady : function(fn, scope, options){
			if(Rel.isReady){
				docReadyEvent || (docReadyEvent = new PK.EventProxy());
				docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clear();
			}
			else {
                if (!docReadyEvent) {
                    initDocReady();
                }
                options = options || {};
                options.delay = options.delay || 1;
                docReadyEvent.addListener(fn, scope, options);
            }
		},
		onReadyPrimacyInvoke : function(fn, scope, options){
			if(Rel.isReady){
				docReadyPrimacy || (docReadyPrimacy = new PK.EventProxy());
				docReadyPrimacy.addListener(fn, scope, options);
                docReadyPrimacy.fire();
                docReadyPrimacy.clear();
			}
			else {
				 if (!docReadyPrimacy) {
                    initDocReady();
                }
                options = options || {};
                options.delay = options.delay || 1;
                docReadyPrimacy.addListener(fn, scope, options);
			}
		}
	};
	
	PK.DocHelper = Rel;
	Cmp.onReady = Rel.onReady;
}());
/**
 * 可观察对象构造类
 * <p>
 * 可观察对象就是会具有事件发送及注册监听器功能。
 * 
 * @class Cmp.util.Observable
 * @extend Object
 *
 * @version 1.0.0
 * @since 2015-08-28
 * @author Jinhai
 */
(function(){
	
	var PK = Cmp.util,
		filterOptRe = /^(?:scope)$/;
	
	
	var Event = function(self, eventName){
		var me = this;
		
		me.self = self,
		me.listeners = [];
		
		
		/**
		 * 获得指定监听器的索引值，如果没有则返回-1；
		 */
		var findIndex = function(l, s){
			var ls = me.listeners,
				i=0,len = ls.length,
				o;
			for(;i<len;i++){
				o = ls[i];
				if(o.listener === l
					&& o.scope === s){
					return i;	
				}
			}
			return -1;
		}
		
		/**
		 * 事件名
		 */
		me.getName = function(){
			return eventName;
		}
		/**
		 * 添加一个该事件的监听器
		 */
		me.addListener = function(listener, scope){
			if(findIndex(listener, scope) === -1){
				me.listeners.push({
					listener : listener,
					scope : scope
				});
			}
		}
		/**
		 * 删除一个监听器
		 */
		me.removeListener = function(listener, scope){
			var index = findIndex(listener, scope);
			if(index > -1){
				me.listeners.splice(index, 1);
			}
		}
		/**
		 * 清除所有的监听器
		 */
		me.clearListeners = function(){
			me.listeners = [];
		},
		/**
		 * 发送事件
		 * @param {Object...} args 
		 */
		me.fire = function(){
			var ls = me.listeners.slice(0),
				i =0, len = ls.length,o,
				rel = true;
			
			for(;i<len;i++){
				o = ls[i];
				if(false === o.listener.apply(o.scope || {}, arguments)){
					rel = false;
				}
			}
			
			return rel;	
		}
	}
	
	/**
	 * 
	 */
	PK.Observable = function(config){
		var me = this;
		if(config.listeners){
			me.on(config.listeners);
		}
	}
	
	//声明原型
	PK.Observable.prototype = {
		/**
		 * 添加一个或多个事件的监听器
		 * <p>
		 * 添加一个可以直接使用参数说明那样的调用方式，但该方法可以支持添加多个事件监听器；调用方式如下：
		 * <code>
		 * var o = new Observabel({....}),
		 * 	   scope = ...;
		 * o.addListener({
		 * 	scope : scope, 			//相当于方法中的scope参数
		 * 	'evnet1' : handler1,	//相当于为'evnet1'事件注册了监听方法handler1
		 * 	'event2' : handler2,	//相当于为'evnet2'事件注册了监听方法handler2
		 *   .
		 *   .
		 *   .
		 *  'evnetN' : handlderN 
		 * 
		 * });
		 * </code>
		 * 
		 * @param {String} (必须)事件名，且该名称必须是已经声明的名称
		 * @param {Function} listenerFn 监听方法
		 * @param {Object} scope 调用监听方法时所设定的设定的this对象，默认为当前对象
		 * @return this
		 */	
		addListener : function(eventName, listenerFn, scope){
			var me = this,
				o,e,oe;
			if (isO(eventName)) {
				o = eventName;
				for (e in o) {
					oe = o[e];
					if(!filterOptRe.test(e)){
						me.addListener(e, oe, o.scope);
					}
				}
			}
			else if(isS(eventName)){
				if(!isF(listenerFn)){
					return ;
				}
				eventName = eventName.toLowerCase();
				ce = me.events[eventName] || true;
				if(isB(ce)){
					me.events[eventName] = ce = new Event(me, eventName);
				}
				ce.addListener(listenerFn, scope);
			}
		},
		/**
		 * 删除指定事件的某个监听器
		 * @param {String} (必须)事件名，且该名称必须是已经声明的名称
		 * @param {Function} listenerFn 监听方法
		 * @param {Object} scope 调用监听方法时所设定的设定的this对象，默认为当前对象
		 * @return this
		 */
		removeListener : function(eventName, listenerFn, scope){
			if(!isS(eventName)){
				return ;
			}
			
			var ce = this.events[eventName.toLowerCase()];
			if(isO(ce)){
				ce.removeListener(listenerFn, scope);
			}
		},
		/**
		 * 分发指定事件
		 * <p>
		 * 分发与接受的说明可以参考下面的代码
		 * <code>
		 * var o = new Observabel();	//创建可观察对象
		 * o.addEvent('evnet');			//注册事件
		 * 
		 * var h1 = function(num1, num2){	//创建监听方法1
		 * 		console.log('handler 1 > num1:'+num1+', num2:'+num2);
		 * 		return num1 > num2;				//根据参数返回true或者是false
		 * } 
		 * o.on('evnet', h1);					//监听
		 * 
		 * var h2 = function(arg1, arg2){
		 * 		console.log('handler 2 > num1:'+num1+', num2:'+num2);
		 * 		return true;				//方法2返回true;
		 * }
		 * o.on('evnet', h2);					//监听
		 * //分发事件
		 * console.log('fierEvent 1 > result:'+o.fireEvent('evnet', 3, 2));		// 控制台会打印出，下面信息：
		 * 															handler 1 > num1:3, num2:2
		 * 															handler 2 > num1:3, num2:2	
		 * 															fierEvent 1 > result:true
		 * //在发送一次事件
		 * console.log('fierEvent 2 > result:'+o.fireEvent('evnet', 1, 2));		// 控制台会打印出，下面信息：
		 * 															handler 1 > num1:1, num2:2
		 * 															handler 2 > num1:1, num2:2	
		 * 															fierEvent 2 > result:false
		 * </code>
		 * 
		 * 
		 * @param {String} eventName 所要分发事件的标识名
		 * @param {Object...} args 调用监听器方法时传入的若干参数。
		 * @return {Boolean} 如果监听方法中有一个方法显式的返回了false，这里
		 */
		fireEvent : function(){
			var me = this,
				a = Array.prototype.slice.call(arguments, 1),
				enm = arguments[0].toLowerCase(),
				rel = true,
				ce = me.events[enm];
			
			if(me.eventsSuspended){
				//处于暂停中
				if(isA(me.eventQueues)){
					me.eventQueues.push(a);
				}
			}
			else if(isO(ce)){
				if(false === ce.fire.apply(ce, a)){
					rel = false;
				}
			}
			
			return rel;
		},
		/**
		 * 释放所有监听器
		 * @return this
		 */
		purgeListeners : function(){
			var es = this.events,
				e,i;
			for(i in es){
				e = es[i];
				if(isO(e)){
					e.clearListeners();
				}
			}
		},
		/**
		 * 为该实例添加事件
		 * <p>
		 * 
		 * @param {String...} evnetNames 所添加的事件
		 */
		addEvents : function(){
			var me = this,
				args = arguments,
				len = args.length;
			
			me.events = me.events || {};
			while(len--){
				me.events[args[len]] = me.events[args[len]] || true;
			}
		},
		/**
		 * 返回true表示当前支持该事件
		 */
		hasListener : function(evnetName){
			var me = this;
			if(isS(evnetName)){
				var e = me.events[eventName.toLowerCase()];
				return isO(e) && e.listeners.length > 0;
			}
			return false;
		},
		/**
		 * 暂停事件的分发
		 * <p>
		 * 暂停后，所有要发送的事件将不会被分发。
		 * @param {Boolean} queueSuspended 如果等于true, 那么在暂停期间所发送的事件
		 * 			将会保存在临时缓存中，等待再次开始分发时发送。
		 * @return this
		 */
		suspendEvents : function(queueSuspended){
			var me = this;
			me.eventsSuspended = true;
			if(queueSuspended && !me.eventQueues){
	            me.eventQueues = [];
	        }
			return me;
		},
		/**
		 * 继续分发事件，如果在暂停期间有事件需要分发，则会被分发。
		 */
		resumeEvents : function(){
			var me = this,
            	qs = me.eventQueues || [];
			 me.eventsSuspended = false;
			 delete me.eventQueues;
			 Cmp.each(qs, function(e){
				 me.fireEvent.apply(me, e);
			 });
		}
	};
	
	var PP = PK.Observable.prototype;
	PP.on = PP.addListener;
	PP.un = PP.removeListener;
}());
/**
 * @class Cmp.util.DelayedTask
 * @extend Object
 * 
 * 延迟任务类
 * <p>
 * 延迟任务类负责在延迟指定时间后调用设定函数，使用场景有以下几种：
 * <p>
 * 场景一: 每次延迟固定的时间后调用同一个方法；
 * <code>
 * //功能方法
 * var handlerFn = function(){ ....; }
 * //创建任务，设定间隔时间功能方法，
 * var task = new Cmp.util.DelayedTask({
 *		delay : 2000,				//固定的延迟时间
 *		handler : handlerFn			//固定的延迟方法
 * });
 * //执行延迟任务。在2000毫秒之后，handlerFn会被调用一次；
 * task.run();
 * </code>
 * <p>
 * 场景二：设定固定的延迟时间，每次执行时再去设定调用的方法
 * <code>
 * //创建任务，设定间隔时间功能方法，
 * var task = new Cmp.util.DelayedTask({
 *		delay : 2000				//固定的延迟时间
 * });
 * task.run({handler : function(){ ....; }});	//延迟调用指定的方法
 * </code>
 * 
 * 场景三：每次都重新设定延迟时间和调用方法；
 * <code>
 * var task = new Cmp.util.DelayedTask();
 * task.run({delay:2000, handler: function(){ ....; }});
 * </code>
 * 
 * 使用延迟任务类，提供延迟调用以外；它还会在设定延迟调用的时候先将上次设定且没有被调用的延迟任务停掉；
 * 这样就可以保证在同一时间一个延迟任务只会执行一个任务。
 * 
 * @class Cmp.util.DelayedTask
 * @extend Object
 *
 * @version 1.0.0
 * @since 2015-09-01
 * @author Jinhai
 */
 (function(){
 	
 	var PK = Cmp.util;
 	
 	/**
 	 * 创建一个延迟任务实例
 	 * <p>
 	 * 配置参数属性说明如下：
 	 * @cfg {Number} delay 延迟时间设定
 	 * @cfg {Function} handler 调用函数
 	 * @cfg {Object} scope 到达时间时，在调用函数时的this对象
 	 * @cfg {Array} args 调用函数时传入的各项参数； 
 	 *
 	 * @constructor
 	 * @param {Object} config 初始化配置参数
 	 */
 	PK.DelayedTask = function(config){
 		config = config || {};
 		var me = this,
 			taskId = false,
 			callFn = config.handler,
 			timeout = config.delay,
 			scope = config.scope,
 			args = config.args;
 		
 		var call = function(){
 		
 			clearInterval(taskId);
 			taskId = false;
 			if(isF(callFn)){
 				callFn.apply(scope, args || []);
 			}
 		} 	
 		/**
 		 * 取消本次执行的任务
 		 */
 		me.cancel = function(){
 			if(taskId){
 				window.clearInterval(taskId);
 				taskId = false;
 			}
 		}
 		/**
 		 * 当前是否在执行中
 		 */
 		me.isRuning = function(){
 			return !!taskId;
 		}
 		/**
 		 * 启动延迟任务
 		 *
 		 * @param {Object} cfg 本次启动任务时的新设定。
 		 */
 		me.run = function(cfg){
 			//取消任务
 			me.cancel();
 			cfg = cfg || {};
			//延迟时间设定
			timeout = isN(cfg.delay) ?  cfg.delay : timeout;
			//调用函数设定
			callFn = isF(cfg.handler) ?  cfg.handler : callFn;
			//this对象
			scope = cfg.scope || scope;
			//参数设定
			args = isA(cfg.args) ? cfg.args : args;
			
			//调用
 			taskId = setInterval(call, timeout);
 		}	
 	};
 
 }());
/**
 * 资源加载器,负责CSS或Js文件的加载;对于已经加载过的将不会再次加载
 *
 * @static Cmp.util.ResourceLoader
 * 
 * @version 2.2.0
 * @since 2016-5-30
 * @author Jinhai
 */
(function(){
	var PK = Cmp.util,
		HEAD,
		currentDirectory,
		httpRex = /^http:\/\/|^https:\/\/|^\/\//,
		ccsRex = /.css$/i,
		loadedJs = {},
		loadCss = {};
	
	/**
	 * 将传入的位置链接转换为绝对路径;
	 * 
	 */
	var getAbstolutePath = function(href){
		if(httpRex.test(href)){
			//已经是绝对路径了
			return href;
		}
		
		var ix,iix,
		 	ps = currentDirectory,
			//替换'//'为'/'
		 	ss = href.replace('//', '/');
	
			
		//去掉位于首位的'/'
		ix = ss.indexOf('/');
		if(ix === 0){
			ss = ss.substring(1);
		}
		
		//如果有'../'这样的，则需要处理
		ix = ss.indexOf('../');
		while(ix === 0){
			ss = ss.substring(3);
			iix = ps.lastIndexOf('/');
			ps = ps.substring(0, iix);
			ix = ss.indexOf('../');
		}
		
		
		return ps+'/'+ss;
	}
	
	/**
	 * 下载指定的CSS文件
	 */
	var doLoadCss = function(herf, cb){
		var dom = loadCss[herf];
		if(dom){
			//已经下载过；
			if(true === dom){
				//等于true表示下载不成功
				cb(false);
			}
			else{
				cb(dom);
			}
			return ;
		}
		dom = document.createElement('link');
		dom.setAttribute('rel','stylesheet');
		dom.setAttribute('type', 'text/css');
		dom.setAttribute('href', herf);
		var onCssLoad = function(){
			loadCss[herf] = dom;
			cb(dom);
		}
		var onCssLoadError = function(){
			putLog('不能加载不存在的文件，文件路径:'+herf, 3);
			loadCss[herf] = true;
			cb(false);
		}
		dom.onload = onCssLoad;
		dom.onerror = onCssLoadError;
		HEAD.appendChild(dom);
		
	}
	/**
	 * 下载指定的Javascript文件
	 */
	var doLoadJavascript = function(src, cb){
		var dom = loadedJs[src]
		if(dom){
			//已经下载过；
			if(true === dom){
				//等于true表示下载不成功
				cb(false);
			}
			else{
				cb(dom);
			}
			return ;
		}
		//创建dom对象
		dom = document.createElement('script');
		dom.setAttribute('type', 'text/javascript');
		dom.setAttribute('src', src);
		var onJsLoad = function(){
			loadedJs[src] = dom;
			cb(dom);
		}
		var onJsLoadError = function(){
			putLog('不能加载不存在的文件，文件路径:'+src, 3);
			loadedJs[src] = true;
			cb(false);
		}
		dom.onload = onJsLoad;
		dom.onerror = onJsLoadError;
		try{
			HEAD.appendChild(dom);
		}
		catch(ex){}
	}
	
	/**
	 * 下载指定资源
	 * @param {String} href 资源的相对或者绝对地址
	 * @param {Function} cb 下载成功后的回调方法，并将引入该资源的Dom对象传入
	 */
	var doLoadResrouce = function(href, cb){
		 //获得绝对路径
		href = getAbstolutePath(href);
		if(ccsRex.test(href)){
			//是CSS文件
			doLoadCss(href, cb);	
		}
		else{
			//是Javasrcipt文件
			doLoadJavascript(href, cb);
		}
	}
	
	/**
	 * @private
	 * @class 资源文件下载任务类
	 *
	 * @param {String/Array} 所要下载资源的链接地址。
	 */
	var LoaderTask = function(href, callback, scope){
		var me = this,
			_res = isA(href) ? href.slice(0) : (isS(href) ? [href]:[]),
			_reDoms = [],
			_callback = callback,
			_scope = scope,
			_length = _res.length,
			_index = -1,
			_loaded = false;
		
		
		
		/**
		 * 开始加载
		 */
		var doLoad = function(cb){
			var r = _res[_index];
			_index++;
			doLoadResrouce(r, function(dom){
				_reDoms[_index-1] = dom;
				if(_index < _length){
					doLoad(cb);
				}
				else{
					cb();
				}			
			});
		}
		
		/**
		 * 采用并行方式下载
		 */
		var doLoadByMore = function(cb){
			me.readCount = 0;
			for(var i=0; i < _length; i++){
				doLoadResrouce(_res[i], function(dom){
					me.readCount++;
					_reDoms.push(dom);
					if(me.readCount == _length){
						cb();
					}
				});
			}
		}
		
		/**
		 * 执行资源下载任务，执行完毕后，调用传入的回调方法；
		 * PS: 传入的回调方法不能覆盖构建时传入的回调方法。
		 * 
		 */
		me.load = function(cb){
			_index = 0;
//			doLoad(cb);
			doLoadByMore(cb);
		}
		/**
		 * 调用构建任务时传入的回调方法
		 */
		me.invokeCallback = function(){
			if(isF(_callback)){
				_callback.call(_scope||window, _reDoms);
			}
		}
	}
	
		//等待执行下载的任务队列
	var delayTaskList = [],
		//正在执行下载的标记：true 有正在执行的下载任务；false 没有执行的下载任务。
		loadingFlag = false;
	
	
	
	/**
	 * 执行一个下载任务
	 */
	var executeLoaderTask = function(task){
		loadingFlag = true;
		//执行加载
		task.load(function(){
			//加载完毕，调用任务的回调方法
			window.setTimeout(function(){
				task.invokeCallback();
			}, 1);
			
			//检测是否还有其他的下载任务
			if(delayTaskList.length > 0){
				var t = delayTaskList.shift();
				executeLoaderTask(t);
			}
			else{
				loadingFlag = false;
			}
		});
	}
	/**
	 * 增加一个下载任务，如果当前没有执行的下载任务，则直接执行。
	 */
	var appendLoaderTask = function(task){
		if(loadingFlag){
			//有任务增在执行
			delayTaskList.push(task);
		}
		else{
			executeLoaderTask(task);
		}
	}

	var LOADER = {
		/**
		 * 加载资源文件。
		 * <p>
		 * 只支持加载js和css两种类型的资源文件。
		 * 
		 * @param {String/Array} href (必须) 资源文件路径或者是路径组成的数组。路径可以为一个绝对路径如：http://localhost:8080/simple/common/js/main-js.js
		 * 							也可以为一个相对路径，如：../js/main-js.js
		 * @param {Function} callback 加载完毕后的调用方法，届时传入引入资源所使用的DOM对象。如果加载不成功，则为一个false值。
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		load : function(href, callback, scope){
			var task = new LoaderTask(href, callback, scope);
			appendLoaderTask(task);
		}
	};
	/**
	 * @private
	 * 初始化，获得当前已经加载的各类资源
	 */
	var init = function(){
		//当前页面所在目录
		var ph = window.location.href,
			ix = ph.indexOf('?'),
			i,len,ts,t,src,v;
			
		if(ix >= 0){
			ph = ph.substring(0, ix);
		}
		ix = ph.lastIndexOf('/');
		if(ix >= 0){
			ph = ph.substring(0, ix);
		}	
		currentDirectory = ph;
//		putLog('ResourceLoader#init>currentDirectory:'+currentDirectory);
		
		HEAD = document.getElementsByTagName('head')[0],
		ts = document.getElementsByTagName('script'),
		i=0,len = ts.length;
					
		for(;i<len;i++){
			t = ts[i];
			src = t.src;
			loadedJs[src] = true;
		}
		
		ts = document.getElementsByTagName('link');
		i=0,len = ts.length;
		for(;i<len;i++){
			t = ts[i];
			src = t.href;
			if(src){
				v = src.toLowerCase();
				ix = v.indexOf('.css');
				if(v.length-4 === ix){
					loadCss[src] = true;
					if(!t.rel){
						t.rel = 'stylesheet';
					}
				}
			}
		}
	}
	
	PK.ResourceLoader = LOADER;
	PK.DocHelper.onReadyPrimacyInvoke(init);
}());
/**
 * @static Cmp.util.LocalStory
 * 用于保存简单数据到本地的工具类,可以将一些字符串保存到本地，且为永久性保存。
 * 通常使用localStorage作为技术实现方式，当不支持该技术时将使用Cookie。
 * 
 * @version 1.0.0
 * @since 2016-10-31
 * @author Jinhai
 */
(function(){
	var toString = function(o){
		return JSON.stringify(o);
	}
	
	var parseToObject = function(s){
		try{
			return JSON.parse(s);
		}
		catch(ex){
			return {};
		}
	}
	/**
	 * 创建基于localStorage的本地存储；
	 */
	var createStoreByHTML5 = function(){
		var storage = window.localStorage,
			rel = {
			};
		
		//初始化
		var v = storage._localcache;
		if(isS(v)){
			rel.data = parseToObject(v);
		}	
		else{
			rel.data = {};
		}
		
		var synToStorage = function(){
			storage._localcache = toString(rel.data);
		}
		
		//get
		rel.get = function(key){
			return isS(key) ? rel.data[key] : undefined;
		
		}
		//save
		rel.save = function(key, value){
			if(!isS(key)){
				return ;
			}
			if(null === value || undefined === value){
				delete rel.data[key];
				synToStorage();
			}
			else if(isN(value) || isB(value) || isS(value)){
				rel.data[key] = value;
				synToStorage();
			}
		}
		return rel;
	}
	
	/**
	 * 创建基于cookie的本地存储；
	 */
	var createStoreByCookie = function(){
		var cookie = document.cookie,
			rel = {};
			
		rel.save = function(){
			//TODO
		}
		rel.get = function(){
			//TODO
		}
		
		return rel;	
	}
	
	/**
	 * @private
	 */
	var stroeInstance;

	var getStore = function(){
		if(!stroeInstance){
			if(window.localStorage){
				stroeInstance = createStoreByHTML5();
			}
			else{
				stroeInstance = createStoreByCookie();
			}
		}
		return stroeInstance;
	
	}
	
	var Store = {
		/**
		 * 保存指定键的值；如果value设定值等于null或undefined则认为是删除原先保存的值；
		 *
		 * @param {String} key (必须)键名称
		 * @param {String/Number/Boolean} value 值;如果等于null或undefined则认为是删除原先保存的值；
		 *		如果不是String/Number/Boolean中的一种类型，则不予处理；
		 */
		save : function(key, value){
			getStore().save(key, value);
		},
		/**
		 * 获取指定键的值
		 */
		get : function(key){
			return getStore().get(key);
		}
	};
	
	Cmp.util.LocalStory = Store;
}());
/**
 * 对于Dom对象的底层控制
 * 
 * @class Cmp.Element
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){

	var PK = Cmp.util,
		DOM = PK.DomHelper,
		Cache = {},
		seq = 1000;

	//支持的事件	
	var SUPPORT_EVENTS = [
		'click','mousedown','mouseup','mousemove','keyup','dblclick','change','keypress','blur','focus',
		'keydown','resize','scroll','mouseover','mouseout','mouseenter','mouseleave','mousewheel','contextmenu','destory',
		'touchstart','touchmove','touchend'];


	var getId = function(){
		return 'el-'+(++seq);
	}
	
	var register = function(el){
		Cache[el.id] = el;
	}
	var unregister = function(el){
		delete Cache[el.id];
	}
	getElById = function(eid){
		return eid ? Cache[eid] : false;
	}
	
	var getElement = function(el){
		if(isS(el)){
			var e = getElById(el);
			if(e){
				return e;
			}
			var dom = document.getElementById(el);
			if(dom){
				return new Cmp.Element(dom);
				
			}
		}
		if(isE(el)){
			var eid = el.id,
				e = getElById(el);
			
			return e || new Cmp.Element(el);
		}
		if(isO(el) && isF(el.hasClass)){
			return el;
		}
		
		return undefined;
	}
	
	var destoryChildrenByDom = function(cns){
		var i=0,len = cns ? (cns.length || 0) : 0,d,el;
		for(;i<len;i++){
			d = cns[i];
			el = getElById(d.id);
			if(el){
				//存在，则调用它的destory方法
				el.destory();
			}
			else{
				//遍历子
				destoryChildrenByDom(d.childNodes);
			}
		}
	}
	
	/**
	 * 销毁指定Element的子孙节点，释放它们所占用的内存空间。
	 * 采用深度优先原则。
	 */
	var destoryChildren = function(){
		var me = this;
		if(me.dom && me.dom.childNodes){
			destoryChildrenByDom(me.dom.childNodes);	
		}
	}
	/**
	 * 创建一个事件代理器
	 */
	var createEventProxy = function(el, eventName){
	
		var rel = new Cmp.util.EventProxy(),
			fn;
		if('destory' == eventName){
			
		}
		else if('resize' == eventName){
			//改变大小无需处理
			if('BODY' === el.dom.tagName){
				DOM.addEvent(el.dom, eventName, function(e){
					rel.fire(e);
				});
			}
		}
		//鼠标滚动事件需要特殊处理
		else if(eventName === 'mousewheel'){
			//鼠标滚动事件
			if(Cmp.isChrome){
				//Chrome
				el.dom.onmousewheel = function(e){
					rel.fire(e);
				}
			}
			else if(Cmp.isFireFox){
				el.dom.addEventListener('DOMMouseScroll', function(e){
					e.wheelDelta = -e.detail;
					rel.fire(e);
				}, false);
			}
			else if(Cmp.isSafari){
				el.dom.addEventListener('DOMMouseScroll', function(e){
					e.wheelDelta = e.detail;
					rel.fire(e);
				}, false);
			}
			else if(Cmp.isIE){
				document.attachEvent('onmousewheel',function(e){
					rel.fire(e);
				});
			}
		}
		else{
			DOM.addEvent(el.dom, eventName, function(e){
				rel.fire(e);
			});
		}

	
		rel.on = rel.addListener;
		rel.un = rel.removeListener;
		return rel;
	}
	
	
	/**
	 * @param {String/HTMLElement} dom
	 */
	Cmp.Element = function(dom){
		if(isS(dom)){
			dom = document.getElementById(dom);
		}
		if(!isE(dom)){
			throw new Error('Cannot found HTMLElement by arg, arg:'+dom);
		}
		
		var me = this;
		me.dom = dom;
		if(dom.id){
			me.id = dom.id
		}
		else{
			me.id = dom.id = getId();
		}
		register(me);
		me.events = {};
	} 
	Cmp.Element.prototype = {
		/**
		 * 添加一个子节点，并返回这个子节点的封装对象
		 * <p>
		 * 新建子节点配置数组对象的配置属性如下：
		 * {String} tag 新建Dom节点名，默认为'div'；
		 * {String/Array} cls 新建Dom节点使用的CSS样式，如果是多个，则为一个数组
		 * {String} id 新建Dom节点的ID
		 * {Object} style 新建Dom节点的style属性设定，默认为null
		 * {Object} atts 新建Dom节点的其他属性设定，key为属性名，value为属性值。注意：此处设定会忽略'id','style','class'这三个属性。
		 * {Object/Array} cns 新建Dom节点的子节点设定，如果是多个则为一个对象数组；对象数组属性不变。 
		 * {String} html 新建Dom对象的innerHTML设定。
		 *
		 * @param {Object/Array} 新建子节点的配置参数对象，如果有多个，则为一个对象数组。
		 * @return {Element} 如果创建了一个，则返回新创建的；如果是多个，则返回最后一个。
		 */
		createChild : function(config){
			var me = this,
				rel;
			if(me.isDestory()){
				return false;
			}
			if(isA(config)){
				for(var i=0, len = config.length;i<len;i++){
					rel = me.createChild(config[i]);
				}
				return rel;
			}
			if(isO(config)){
				config.parentNode = me.dom;
				rel = DOM.createDom(config);
				rel = new Cmp.Element(rel);
			}
			if(config.cns){
				rel.createChild(config.cns);
			}
			return rel;
		},
		/**
		 * 设定该Dom节点的隐藏形式。
		 *
		 * @param {String} modal 隐藏形式；支持'visibility'|'display' 前者在隐藏时还会占用原先的位置和大小；后者不会。默认:'visibility'
		 */
		setHideModal : function(modal){
			var me = this;
			me.hideModal = modal;
		},
		/**
		 * 显示该节点
		 */
		show : function(){
			var me = this;
			if(me.isDestory()){
				return ;
			}
			if('display' === me.hideModal){
				DOM.setStyle(me.dom, 'display', me.showStyleValue || '');
			}
			else{
				DOM.setStyle(me.dom, 'visibility', me.showStyleValue || '');
			}
		},
		/**
		 * 隐藏该节点
		 */
		hide : function(){
			var me = this;
			if(me.isDestory()){
				return ;
			}
			
			if('display' === me.hideModal){
				DOM.setStyle(me.dom, 'display', 'none');
			}
			else{
				DOM.setStyle(me.dom, 'visibility', 'hidden');
			}
		},
		/**
		 * 设定所控制Dom的属性，但是不能设定'id','style','className'这三个属性。
		 * @param {Object/String} key 以名值对形式组成的对象或者是属性名称
		 * @param {Object} value 设定的值，当key为一个对象时该参数无效
		 */
		setAttribute : function(key, value){
			var me = this;
			if(!me.isDestory()){
				DOM.setAttribute(me.dom, key, value);
			}
			return me;
		},
		/**
		 * 删除所控制Dom的指定属性，但是不能是'id','style','className'这三个。
		 * @param {Array/String} key 属性名称或者是属性名组成的数组。
		 */
		removeAttribute : function(key){
			var me = this;
			if(!me.isDestory()){
				DOM.removeAttribute(me.dom, key);
			}
			return me;
		},
		/**
		 * 获得指定属性的值
		 * @param {Array/String} key 属性名称或者是属性名组成的数组。
		 * @return {String/Object} 属性值(当key为字符串时)或属性名值对(key为一个数组时)
		 */
		getAttribute : function(key){
			var me = this;
			if(!me.isDestory()){
				return DOM.getAttribute(me.dom, key);
			}
			return undefined;
		},
		
		/**
		 * 添加指定的CSS样式
		 * @param {String/Array} cls CSS样式名，如果是多个，则是样式名组成的数组。
		 * @return {Element} this
		 */
		addClass : function(cls){
			var me = this;
			if(!me.isDestory()){
				DOM.addClass(me.dom, cls);
			}
			return me;
		},
		/**
		 * 删除指定的样式
		 */
		removeClass : function(cls){
			var me = this;
			if(!me.isDestory()){
				DOM.removeClass(me.dom, cls);
			}
			return me;
		},
		/**
		 * 重新设定CSS样式
		 * @param {String/Array} cls CSS样式名，如果是多个，则是样式名组成的数组。
		 * @return {Element} this
		 */
		setClass : function(cls){
			var me = this;
			if(!me.isDestory()){
				DOM.setClass(me.dom, cls);
			}
			return me;
		},
		/**
		 * 确定是否当前是否设定了指定的CSS；
		 * @param {String/Array} cls 一个或多个CSS样式名
		 * @return {Boolean} 返回true表示设定了指定的样式。
		 */
		hasClass : function(cls){
			var me = this;
			if(me.isDestory()){
				return false;
			}
			if(isS(cls)){
				cls = [cls];
			}
			if(isA(cls)){
				var meCls = DOM.getClass(me.dom);
				for(var i=0, len = cls.length; i<len; i++){
					if(meCls.indexOf(cls[i]) < 0){
						return false;
					}
				}
			}
			return true;
			
		},
		/**
		 * 获得设定的显示样式原生值。
		 */
		getStyle : function(key){
			var me = this;
			if(!me.isDestory()){
				return DOM.getStyle(me.dom, key);
			}
		},
		/**
		 * 设置显示属性，此处为原生形式
		 * @param {Obejct/String} key 以名值对形势构建的多个显示属性配置或者是显示属性名；
		 * @param {Object} value 设定值；当key为一个对象时，该设定无效。
		 */
		setStyle : function(key, value){
			var me = this;
			if(!me.isDestory()){
				DOM.setStyle(me.dom, key, value);
			}
		},
		/**
		 * 更新该Dom对象的innerHTML的值
		 * @param {String} html
		 */
		update : function(html){
			var me = this;
			if(!me.isDestory()){
				destoryChildren.call(me);
				me.dom.innerHTML = html;
			}
		},
		/**
		 * 添加指定事件的监听器
	     * @param {String} eventName 事件名
	     * @param {Function} callFn 监听方法
	     * @param {Object} scope 调用监听方法时设定的this对象
		 */
		on : function(eventName, callFn, scope){
			var me = this;
	    	if(me.isDestory() || !isS(eventName) || !isF(callFn)){
	    		return me;
	    	}
	    	eventName = eventName.trim().toLowerCase();
	    	if(SUPPORT_EVENTS.indexOf(eventName) > -1){
	    		var event = me.events[eventName];
	    		if(!event){
	    			event = createEventProxy(me, eventName);
	    			me.events[eventName] = event;
	    		} 
	    		
	    		event.on(callFn, scope);
	    	}
	    	return me;
		},
		/**
		 * 删除指定事件的监听器
		 */
		un : function(eventName, callFn, scope){
			var me = this;
	    	if(me.isDestory() || !isS(eventName) || !isF(callFn)){
	    		return me;
	    	}
	    	eventName = eventName.trim().toLowerCase();
	    	
	    	if(SUPPORT_EVENTS.indexOf(eventName) > -1){
	    		var event = me.events[eventName];
	    		if(event){
	    			event.un(callFn, scope);
	    		}
	    	}
	    	return me;
		},
		/**
		 * 从父节点上删除该节点
		 * @param {Boolean} unDestory 等于true时不会销毁该节点。
		 */
		remove : function(unDestory){
			var me = this;
			if(!me.isDestory() && DOM.remove(me.dom)
				&& true !== unDestory){
				me.destory();
			}
		},
		/**
		 * 销毁该Element对象以及子孙对象所占用的内存资源。
		 */
		destory : function(){
			var me = this,
				i,o,
	    		dom = me.dom;
	    	
	    	if(!dom){
	    		return ;
	    	}
	    	//分发销毁事件
	    	o = me.events['destory'];
	    	if(o){
	    		o.fire(me);
	    	}
	    	
	    	//先销毁子孙对象
	    	destoryChildren.call(me);
	    	//再销毁本身
	    	for(i in me.events){
	    		o = me.events[i];
	    		o.destory();
	    	}
	    	unregister(me);
	    	delete me.dom;
		},
		/**
		 * 返回true时表示当前dom已经被销毁
		 */
		isDestory : function(){
			return !this.dom;
		}
	
	};
	
	var initDoc = function(){
		var bd = new Cmp.Element(document.body);
		if(Cmp.isChrome){
			bd.addClass('b-chrome');
		}
		Cmp.getBody = function(){
			return bd;
		}
	}
	
	Cmp.get = getElement;
	Cmp.util.DocHelper.onReadyPrimacyInvoke(initDoc);
}());
/**
 * Element关于大小设定方面上的扩展
 */
(function(){ 
	var DH = Cmp.util.DomHelper,
		UV = Cmp.util.ValueHelper;

	Cmp.applyIf(Cmp.Element.prototype, {
		/**
		 * 设定大小；
		 * @param {String/Number/Object} w 格式如{width:{String/Number}w, height:{String/Number}h}的大小设定数据对象
		 *		或者是具体的宽度设定值，当为一个数字时就是具体的像素值。
		 * @param {String/Number} h 高度设定值， 当为一个数字时就是像素值。
		 */
		setSize : function(w, h){
			var me = this;
			if(isO(w)){
				h = w.height;
				w = w.width;
			}
			
			if(w && h){
				DH.setWidth(me.dom, w);
				DH.setHeight(me.dom, h);
				me.fireResizeEvent();
			}
		},
		/**
		 * 设定宽度
		 */
		setWidth : function(w){
			var me = this;
			DH.setWidth(me.dom, w);
			me.fireResizeEvent();
		},
		/**
		 * 设定高度
		 */
		setHeight : function(h){
			var me = this;
			DH.setHeight(me.dom, h);
			me.fireResizeEvent();
		},
		/**
		 * 获得宽度；此宽度包括内容宽度+边框宽度+内边距宽度。
		 */
		getWidth : function(){
			return DH.getWidth(this.dom);
		},
		/**
		 * 获得高度；此宽度包括内容高度+边框宽度+内边距高度。
		 */
		getHeight : function(){
			return DH.getHeight(this.dom);
		},
		/**
		 * 获得此节点大小，包括：内容大小+边框宽度+内边距；
		 */
		getSize : function(){
			var me = this;
			return {
				width : me.getWidth(),
				height : me.getHeight()
			};
		},
		/**
		 * @private
		 * 分发大小改变事件。
		 */
		fireResizeEvent : function(){
			var me = this,
				event = me.events['resize'];
			if(event){
				event.fire(me);
			}	
		} 
	});
}());	
/**
 * Element关于位置设定方面上的扩展
 */
(function(){

	var DH = Cmp.util.DomHelper;

	Cmp.applyIf(Cmp.Element.prototype, {
		/**
		 * 获得该节点相对于整个浏览器窗口的像素级横坐标值
		 * @return {Number} 横坐标数值
		 */
		getX : function(){
			var v = DH.getXY(this.dom);
			return v[0];
		},
		/**
		 * 获得该节点相对于整个浏览器窗口的像素级纵坐标值
		 * @return {Number} 横坐标数值
		 */
		getY : function(){
			var v = DH.getXY(this.dom);
			return v[1];		
		},
		/**
		 * 获得该节点相对于整个浏览器窗口的像素级位置
		 *
		 * @return {Array} 格式如：[x,y]的数据，xy[0]为横坐标，xy[1]为纵坐标
		 */
		getXY : function(){
			return DH.getXY(this.dom);
		},
		/**
		 * 设定该节点的left和top属性。
		 * @param {String/Number/Array/Object} x 格式如{left:{String/Number}x,top:{String/Number}y}的位置描述对象
		 *			或者是格式如[{String/Number}x,{String/Number}y]的数组
		 *			或者是左侧位置设定值，当为一个数值时表示时一个像素设定值。
		 */
		setLeftTop : function(x, y){
			var me = this;
			
			if(isO(x)){
				y = x.top || x.y;
				x = x.left || x.x;
			}
			else if(isA(x)){
				y = x[1];
				x = x[0];
			}
			
			x = isN(x) ? x+'px':x;
			y = isN(y) ? y+'px':y;
			
			if(isS(x) && isS(y)){
				DH.setStyle(me.dom, {
					left : x,
					top : y
				});
			}
		},
		/**
		 * 设定该节点的left属性
		 * 
		 * @param {String/Number} x 左侧位置设定值，当为一个数值时表示时一个像素设定值。
		 */
		setLeft : function(x){
			x = isN(x) ? x+'px':x;
			if(isS(x)){
				DH.setStyle(this.dom, 'left', x);
			}
		},
		/**
		 * 获得left设定值
		 * @return {Number} left设置数值
		 */
		getLeft : function(){
			return DH.getStyleNumber(this.dom, 'left');
		},
		/**
		 * 设定该节点的top属性
		 * @param {String/Number} y 上侧位置设定值，当为一个数值时表示时一个像素设定值。
		 */
		setTop : function(y){
			y = isN(y) ? y+'px':y;
			if(isS(y)){
				DH.setStyle(this.dom, 'top', y);
			}
		},
		/**
		 * 获得top设定值
		 * @return {Number} left设置数值
		 */
		getTop : function(){
			return DH.getStyleNumber(this.dom, 'top');
		}
	});
}());
/**
 * 对于Dom对象的底层控制之对于一些特殊的显示属性高级应用。
 * 
 * @class Cmp.Element
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){

	var DH = Cmp.util.DomHelper;

	Cmp.applyIf(Cmp.Element.prototype, {
		/**
		 * 获得滚动条宽度
		 */
		getScrollWidth : function(){
			return 18;
		},
	
		/**
		 * 检测滚动条是否出现了
		 * @return {Boolean} 返回true表示横向或纵向滚动条出现了。
		 */
		isScrollBarVisabeld : function(){
			var me = this;
			return me.isLeftScrollBarVisabeld() || me.isTopScrollBarVisabeld();
		},
		/**
		 * 检测横向滚动条是否出现了
		 * @return {Boolean} 返回true表示横向滚动条出现了。
		 */
		isLeftScrollBarVisabeld : function(){
			var dom = this.dom,
				v = DH.getStyle(dom, 'overflowX');
			if('visible' === v || 'hidden' === v){
				return false;
			}
			else if('scroll' === v){
				return true;
			}
			else{
				//自动，TNND，最捣乱的一个
				return dom.scrollHeight > dom.offsetHeight;
			}
		},
		/**
		 * 检测纵向滚动条是否出现了
		 * @return {Boolean} 返回true表示纵向滚动条出现了。
		 */
		isTopScrollBarVisabeld : function(){
			var dom = this.dom,
				v = DH.getStyle(dom, 'overflowY');
			if('visible' === v || 'hidden' === v){
				return false;
			}
			else if('scroll' === v){
				return true;
			}
			else{
				//自动，TNND，最捣乱的一个
				return dom.scrollWidth > dom.offsetWidth;
			}
		} 
	});
}());
/**
 * 对于指定Dom上的层次管理
 * 
 * @version 2.0.0
 * @since 2016-3-30
 * @author Jinhai
 */
(function(){

	Cmp.applyIf(Cmp.Element.prototype, {
	
		/**
		 * 创建一个遮罩层；
		 * @param {String} key 这个遮罩层的Key
		 * @param {Number} zIndex 这个遮罩层的层数。默认为100000； 
		 * @return {Element} mask的Element对象。
		 */
		createMask : function(key, zIndex){
			var me = this,
				m;
			if(!me.masks){
				me.masks = {};
			}	
			m = me.masks[key];
			if(!m){
				m = me.createChild({
					cls : 'c-mask',
					style : {
						zIndex : zIndex || 100000
					}
				});
				m.setHideModal('display');
				m.hide();
				me.masks[key] = m;
			}
			
			return m;			
		}
	});
}());
/**
 * 部件的基础实现类。
 * <p>
 * 所有高级的显示部件/组件/容器都是继承此类的。部件中可以分成两大类：
 * 第一种为具有具体展示内容及功能的组件/控件类，如：列表，表格，按纽，录入框等；
 * 
 * 第二种为具有承载其他部件的容器类，这种类型的部件都可以通过设定布局管理器而达到布局的目的。 
 *
 * @class Cmp.Widget
 * @extend Cmp.util.Observable
 * 
 * @version 1.0.0
 * @since 2015-08-28
 * @author Jinhai
 */
(function(){
	
	var PK = Cmp,
		UV = Cmp.util.ValueHelper,
		Cache = {},
		TypeCache = {},
		seq = 10000,
		buildId = function(){
			return 'cmp-'+(++seq);
		},
		release = function(cmp){
			var k = isS(cmp) ? cmp : cmp.id;
			delete Cache[k];
		}
		register = function(cmp){
			var k = cmp.getId();
			Cache[cmp.getId()] = cmp;
		},
		getCmp = function(cmpId){
			return Cache[cmpId];
		};
	
	/**
	 * 注册一种部件的实现
	 */
	var registerWidget = function(type, widgetClass){
		if(isS(type) && isF(widgetClass)){
			type = type.toLowerCase();
			TypeCache[type] = widgetClass;
		}
	}
	
	/**
	 * 创建一个部件。
	 */
	var createWidget = function(config){
		if(!isO(config)){
			return undefined;
		}
		if(isF(config.render)){
			return config;
		}
		var type = config['xtype'],
			fn;
		if(isS(type)){
			type = type.toLowerCase();
			fn = TypeCache[type];
		}
		if(!isF(fn)){
			fn = PK.Widget;
		}
		return new fn(config);
	}
	
	PK.Widget = function(config){
		config = config || {};
		
		var me = this,
			id,el;
		
		
		
		config.id = config.id || buildId();
		
		Cmp.apply(me, config);
		
		register(me);
		me.addEvents(
			/**
			 * @event
			 * 当部件渲染成功后，分发此事件
			 * @param {Widget} this
			 */
			'render',
			/**
			 * @event
			 * 当该部件大小发生改变时，发送该事件。触发该事件的方法为：setSize，setWidth，setHeight
			 *
			 * @param {Number} width 新设定的宽度值
			 * @param {Number} height 新设定的高度值
			 * @param {Widget} this
			 */
			'resize'
		);
		
		me.initComponent();
		PK.Widget.superclass.constructor.call(me, config);
		
		
		if(true === me.autoRender){
			me.render();
		}
		delete me.autoRender;
	};
	Cmp.extend(PK.Widget, Cmp.util.Observable, {
		/**
		 * @Cfg {Mixed} applyTo 该部件所要绑定的Dom对象；它可以是一个Dom的ID，
		 *			也可以是一个HTMLElement对象；
		 */
		/**
		 * @Cfg {Mixed} renderTo 该部件所要绘制到的Dom对象，如果设置该属性，则该部件所绑定
		 *			的Dom会成为这个对象的子Dom；
		 */
		
		/**
		 * @cfg {String} id 该部件在缓存中的ID值，如果不设定，则使用#applyTo所配置Dom的ID值；
		 *		假如Dom对象也没有配置ID值，则自行创建一个。
		 */ 
		
		/**
		 * @cfg {Boolean} autoRender 等于true时会在创建完毕后自动调用渲染方法。默认为false
		 */
		
		/**
		 * 获得该部件在部件缓存中的ID值。
		 */	
		getId : function(){
			return this.id;
		},
		
		/**
		 * 部件初始化方法，由基础部件Widget类在构造时调用该方法。
		 * 该方法用于子类初始化自己的配置属性。
		 */
		initComponent : Cmp.emptyFn,
		/**
		 * 设定该部件大小
		 * 
		 * @param {Number/Array/Object} width 当为一个数值时为这个部件的宽度值；或者为一个[width,height]格式的数组，或者是具有width和height属性的对象
		 * @param {Number} height 高度值
		 */
		setSize : function(width, height){
			var me = this;
//			putLog('Widget#setSize> width:'+width+', height:'+height);
			
			if(me.rendered){
				me.el.setSize(width, height);
				me.onResize();
				me.fireEvent('resize', width, height, me);
			}
			else{
				if(isA(width)){
					height = UV.toInteger(width[1], me.height);
					width = UV.toInteger(width[0], me.width);
				}
				else if(isO(width)){
					height = UV.toInteger(width.height, me.height);
					width = UV.toInteger(width.width, me.width);
				}
				else{
					width = UV.toInteger(width, me.width);
					height = UV.toInteger(height, me.height);
				}
				me.width = width;
				me.height = height;
			}
		},
		/**
		 * 获得该部件的大小
		 * @return {Object} 返回一个格式如：{width:Number, height:Number}这样的数据对象。
		 */
		getSize : function(){
			var me = this;
			if(me.rendered){
				return me.el.getSize();
			}
			else{
				return {
					width : me.width || 0,
					height : me.height || 0
				};
			}
		},
		/**
		 * 设定该部件的宽度
		 */
		setWidth : function(width){
			var me = this;
			if(me.rendered){
				me.el.setWidth(width);
				me.onResize();
				me.fireEvent('resize', width, me.el.getHeight(), me);
			}
			else{
				me.width = UV.toInteger(width, me.width);
			}
		},
		/**
		 * 设定该部件的高度
		 */
		setHeight : function(height){
			var me = this;
			if(me.rendered){
				me.el.setHeight(height);
				me.onResize();
				me.fireEvent('resize', me.el.getWidth(), height, me);
			}
			else{
				me.height = UV.toInteger(height, me.height);
			}
		},
		getHeight : function(){
			var me = this;
			if(me.rendered){
				return me.el.getHeight();
			}
			else{
				return me.height || 0;
			}
		},
		/**
		 * 设定该部件的left和top的属性值。
		 * @param {Number/String/Array/Object} left 设定的横坐标值或者是格式如[left,top]数组或者是具有left和top属性的数据对象；
		 *			当为一个数值时，则认为是像素单位的值。 字符串则认为是最终的设定值
		 * @param {Number/String} top 设定的纵坐标值，当为一个数值时，则认为是像素单位的值。 字符串则认为是最终的设定值
		 */
		setLeftAndTop : function(left, top){
			var me = this,
				r = false,o = {};
			if(isA(left)){
				top = left[1];
				left = left[0];
			}
			else if(isO(left)){
				top = left.top;
				left = left.left;
			}
			
			left = isN(left) ? left+'px':left;
			top = isN(top) ? top+'px':top;
			
			if(isS(left)){
				o.left = left;
				r = true;
			}
			if(isS(top)){
				o.top = top;
				r = true;
			}
			if(r){
				me.setStyle(o);
			}
		},
		/**
		 * 设定该部件所控制Dom的CSS样式属性
		 * 
		 * @param {String/Object} key 当为一个字符串时，为这个属性的key值；如果为一个对象，则是以key和value组成的style设定对象。
		 * @param {String} value 样式值。
		 */
		setStyle : function(key, value){
			if(!key){
				return ;
			}
			var me = this;
			if(me.rendered){
				return me.el.setStyle(key, value);
			}
			else{
				var style = me.style || {};
				if(isO(key)){
					Cmp.apply(style, key);
				}
				else if(isS(key)){
					style[key] = value;
				}
				me.style = style;
			}
		},
		hide : function(){
			var me = this;
			if(!me.hidden){
				me.hidden = true;
				if(me.rendered){
					me.el.hide();
				}
			}
		},
		show : function(){
			var me = this;
			if(me.hidden){
				me.hidden = false;
				if(me.rendered){
					me.el.show();
				}
			}
		},
		/**
		 * @final 子类不得重写该方法
		 * 渲染该部件，如果该部件已经渲染过，则不会再次渲染；
		 * 该方法回去判断是否已经渲染过，如果没有被渲染过则会依次调用doRender方法;渲染成功后会分发'render'事件
		 * 
		 * @param {Mixed} target 绘制此部件的父节点目标；
		 */
		render : function(target){
			var me = this;
			
			if(me.rendered){
				return ;
			}
			target = Cmp.get(target) || Cmp.get(me.renderTo);
			if(target){
				me.parent = target;
			}
			
			if(me.applyTo){
				me.applyTo = Cmp.get(me.applyTo);
				if(me.applyTo){
					me.el = me.applyTo;
					if(me.cls){
						me.el.addClass(me.cls);
					}
					delete me.applyTo;
					if(me.parent){
						var pnode = me.el.dom.parentNode,
							ppnode = me.parent.dom;
						
						if(ppnode != pnode){
							pnode.removeChild(me.el.dom);
							ppnode.appendChild(me.el.dom)
						}	
					}
				}
			}
			else if(me.parent){
				var style = me.style || {};
				if(me.width){
					if(isN(me.width)){
						style.width = me.width+'px';
					}
					else{
						style.width = me.width;
					}
				}
				if(me.height){
					if(isN(me.height)){
						style.height = me.height+'px';
					}
					else{
						style.height = me.height;
					}
				}
				me.el = me.parent.createChild({
					tag : me.tagName || 'div',
					id : me.getId(),
					cls : me.cls,
					style : style
				});
				if(me.x || me.y){
					me.el.setXY([me.x, me.y]);
				}
			}
			else{
				throw new Error('Cannot render Widget with apply dom doesn\'t exist!');
			}
			
			me.doRender();
			delete me.x;
			delete me.y;
			delete me.width;
			delete me.height;
			delete me.style;
			me.rendered = true;
			me.fireEvent('render', me);
		},
		/**
		 * @public
		 * 销毁该部件占用的所有资源
		 * @final 子类不能重写该方法，请重写doDestroy()方法满足该需要。
		 */
		destroy : function(){
			var me = this;
			if(!me.destroied){
				me.purgeListeners();
				me.doDestroy();
				if(me.el){
					me.el.remove();
					delete me.el;
				}
				release(me);
				me.rendered = false;
				me.destroied = true;
			}
		},
		/*
		 * =====================================================================
		 * 以下均为私有方法，不可被其他类进行调用；但是这些方法要由子类负责实现，并进行扩展。
		 * 子类在实现时，一定要调用父类，调用方式如： 
		 * SubClass.superclass.fn.call(this, args...);
		 * =====================================================================
		 */
		/**
		 * @private
		 * 绘制该部件内容的私有方法，该方法由render方法调用。
		 */
		doRender : function(){
			var me = this;
			if(isS(me.html)){
				me.el.update(me.html);
			}
		},
		/**
		 * @private
		 * 通知子类告知该部件大小发生改变的私有方法，该方法只由Widget类负责调用。
		 */
		onResize : Cmp.emptyFn,
		/**
		 * @private
		 * 销毁该部件的私有方法，该方法由destroy方法调用。
		 */
		doDestroy : Cmp.emptyFn
	});
	
	Cmp.register = registerWidget;
	Cmp.createWidget = createWidget;
	Cmp.getCmp = getCmp;
	
	/**
	 * 调用指定部件实例上的指定方法
	 *
	 * 参数必须为2个或2个以上；其中第一个为这个部件的标识ID(暨Widget#getId()的值)；第二个为这个部件上的方法名；
	 * 剩余的将作为调用这个方法时的入参；
	 */
	Cmp.invockCmpFunction = function(){
		if(arguments.length < 2){
			//缺少参数无法调用
			return ;
		}
		var cmpId = arguments[0],
			fnName = arguments[1],
			args = [],
			cmp = Cmp.getCmp(cmpId);
		
		for(var i=2,len = arguments.length; i<len; i++){
			args.push(arguments[i]);
		}
			
			
		if(cmp && isF(cmp[fnName])){
			cmp[fnName].apply(cmp, args);
		}	
	}
}());
/**
 * @packge Cmp.req
 * @class Cmp.req.Module
 * @extend Object
 * 
 * 模块定义类。
 *
 * @version 2.2.0
 * @since 2016-5-30
 * @author Jinhai
 */
(function(){

	var PK = Cmp.req;
	
	/**
	 * @constructor
	 * 
	 * @param {Context} ctx 该模块所在的运行上下文
	 * @param {String} moduleId 模块标识
	 */
	PK.Module = function(ctx, moduleId){
		var me = this,
			_id = moduleId;
			
		me.context = ctx;
		me.ready = false;
		//声明三个标记位，等到最后都下载完毕后再删除
		me.loadedJs = false;
		me.loadedCss = false;
		me.loadedDependModule = false;
			
		/**
		 * @public
		 * 获得该模块的标识
		 */
		me.getId = function(){
			return _id;
		}	
	}
	PK.Module.prototype = {
		/**
		 * 初始化该模块；完毕后调用回调方法
		 * 如果当前模块所需资源还没有下载，则不能初始化。
		 *
		 * @param {Function} cb (可选)初始化完毕后，调用的方法。调用时，传入模块实例。
		 * @param {Object} scope (可选)调用回调方法时的this对象设定。默认为undefined
		 */
		init : function(cb, scope){
			var me = this;
			if(me.isReady()){
				Cmp.invoke(cb, scope, [me]);
				return ;
			}
//			putLog('Module#init> module:'+me.getId());
			//将回调方法放到Ready对列中
			me.onReady(cb, scope);
			if(me.loading){
				//正在加载中
				return ;
			}
			me.loading = true;
			//加载JS，因为JS文件
			me.context.loadModule(me.getId(), me.onLoadModuleJs, me);
		},
		/**
		 * @public
		 * 返回true表示已经准备完毕。暨已经初始化完毕。
		 */
		isReady : function(){
			return this.ready;
		},
		/**
		 * @public
		 * 增加一个当初始化完毕后的监听方法。
		 *
		 * @param {Function} l (必须)监听方法;调用时传入该上下文实例。调用时会将模块实例传入
		 * @param {Object} scope (可选)调用监听方法时的this对象设定。默认为undefined
		 */
		onReady : function(callback, scope){
			var me = this;
			if(me.isReady()){
				Cmp.invoke(callback, scope);
			}
			else{
				if(!me.readyListeners){
					me.readyListeners = [];
				}
				me.readyListeners.push({
					fn : callback,
					scope : scope
				});
			}
		},
		/**
		 * @public
		 * 设定该模块的实现原型
		 *
		 * @cfg {Function} factory (必须)模块工厂方法，用于生成模块；
		 *			如果返回一个对象，则表示定义模块为一个静态对象，可以直接使用。
		 *			如果返回一个方法，则表示定义的模块为一个构造方法，可以被实例化。
		 * 			调用工程方法时会传入扩展模块和依赖模块。
		 * @cfg {String} extend (可选)扩展模块标识
		 * @cfg {Array/String} requires (可选)依赖模块标识；依赖指的是显式调用的模块，而那些依赖模块所扩展或以依赖的可以不写。
		 * @cfg (Boolean/String/Array) cls (可选)该模块需要加载CSS标记；默认为false。
		 *			等于true时，表示加载CSS文件与模块同在一个目录下。且名称与模块名一致。
		 *			为一个字符串时，表示加载一个CSS文件，其位置为基于一级模块源路径的相对位置路径或绝对位置路径。注意：绝对路径必须要添加http://或https://前缀
		 *			为一个数组时，表示要加载多个CSS文件；位置同一个文件的含义。
		 *
		 * @param {Boolean/Object} config 原型的配置对象，具有的属性参考方法中的@cfg注释; 等于true时，
		 *		表示该模块采用的是全局命名空间(Namespace)形式开发的；
		 * @param {Boolean} modulePathFlag 等于true时表示属于在模块包前置资源加载中，此时不会加载其他资源
		 */
		setModulePrototype : function(config, modulePathFlag){
			
			var me = this;
//			putLog('Module#setModulePrototype> module:'+me.getId()+', config:'+config);
			if(me.modulePrototype){
				//已经配置过，不能再次配置
				return ;
			}
			me.modulePrototype = config;
			if(modulePathFlag){
				//无需加载JS和CSS
				me.loadedJs = true;
				me.loadedCss = true;
				//当位于前置资源加载中，直接加载以来的扩展模块和依赖模块
				me.loadExtendModule();
			}
			else if(isO(config)){
				//依次加载，扩展模块和依赖模块
				me.loadExtendModule();
				//同时加载所需的CSS
				me.loadCss();
			}
			else if(true === config){
				//采用命名空间形式开发
				me.loadedDependModule = true;
				me.loadedCss = true;
				
				var ms = me.getId().split('.'),
					o,m;
				o = window;
				while(o && ms.length > 0){
					m = ms.shift();
					o = o[m];
				}
				me.instance = o;
				me.tryReady();
			}
		},
		/**
		 * @public
		 * 获得模块实例，暨原型中调用factory后得到的对象或方法。
		 * 
		 * @return {Object/Function} 调用原型中factory方法后得到的对象或方法。如果当前模块还没有初始化，则返回undefined;
		 */
		getInstance : function(){
			return this.instance;
		},
		/**
		 * @private
		 * 加载完JS文件后的回调方法。
		 */
		onLoadModuleJs : function(){
			var me = this;
			me.loadedJs = true;
			me.tryReady();
		},
		/**
		 * @private
		 * 检测三个标记位；如果三个标记位都为true，则将ready标记位置呈true,并发送onready事件
		 */
		tryReady : function(){
			var me = this;
			if(true !== me.loadedJs 
				|| true !== me.loadedDependModule
				|| true !== me.loadedCss){
				return ;
			}
			me.ready = true;
			
			delete me.loading;
			delete me.loadedJs;
			delete me.loadedDependModule;
			delete me.loadedCss;
			
			var ls = me.readyListeners,
				l,i=0,len = isA(ls) ? ls.length:0;
				
			for(;i<len;i++){
				l = ls[i];
				Cmp.delayInvoke(l.fn, l.scope, [me.instance]);
			}	
		},
		
		/**
		 * @private
		 * 加载扩展模块，完后加载依赖模块
		 */
		loadExtendModule : function(){
			var me = this,
				ext = me.modulePrototype.extend;
			if(isS(ext)){
				me.context.require(ext, function(){
					me.extendModule = arguments[0];
					me.loadRequiresModule();
				});
			}	
			else{
				me.loadRequiresModule();
			}
		}, 
		/**
		 * @private
		 * 加载依赖模块，完后创建模块实例
		 */
		loadRequiresModule : function(){
			var me = this,
				rs = me.modulePrototype.requires;
			if(isS(rs) || (isA(rs) && rs.length > 0)){
				me.context.require(rs, function(){
					me.requireModules = arguments;
					me.onloadedDepend();
				});
			}
			else{
				me.onloadedDepend();
			}	
		}, 
		/**
		 * @private
		 * 创建模块实例；将loadedDependModule置为true.并调用tryReady方法
		 */
		onloadedDepend : function(){
			var me = this,
				fn = me.modulePrototype.factory;
			if(isF(fn)){
				me.instance = fn(me.extendModule, me.requireModules);
			}	
			else{
				me.instance = {};
			}
			me.loadedDependModule = true;
			me.tryReady();
		},
		/**
		 * @private
		 * 加载CSS，完后加载依赖模块
		 */
		loadCss : function(){
			var me = this,
				cls = me.modulePrototype.cls;
			//加载CSS可以不用等到下载后再去直接告知	
			if(true === cls || isS(cls) || isA(cls)){
				me.context.loadMoudleCss(me.getId(), cls);	
			}
			
			me.loadedCss = true;
			me.tryReady();
		}
	};
}());
/**
 * @packge Cmp.req
 * @class Cmp.req.ModuleLoader
 * @extend Object
 * 
 * 模块资源下载类
 * 
 */
(function(){

	var PK = Cmp.req,
		RD = Cmp.util.ResourceLoader;
	
	/**
	 * 合并路径
	 */
	var appendPath = function(basePath, offsetPath){
		if(!isS(offsetPath) || '' === offsetPath || './' === offsetPath){
			return basePath;
		}
		if(offsetPath.indexOf('//') === 0 
			|| offsetPath.indexOf('http://') === 0
			|| offsetPath.indexOf('https://') === 0){
			//传入的offsetPath为一个绝对路径
			return 	offsetPath;
		}
			
		
		var bp = basePath,
			op = offsetPath,
			ix = op.indexOf('../'),
			iix;
		while(0 === ix){
			iix = bp.lastIndexOf('/');
			bp = bp.substring(0, iix);
			op = op.substring(3);
			ix = op.indexOf('../')
		}	
		if('' === op){
			return bp;
		}
		else{
			return bp+'/'+op;
		}
	}
	
	/**
	 * @constructor
	 *
	 * @cfg {String} module (可选)模块标识；如果定义的是一级模块，则说明该模块下的子模块也是用该配置。除非它自己进行配置。默认为:'';
	 * @cfg {String} baseUrl (可选)该模块源代码的基本位置，它是基于运行上下文的相对位置，也可以是一个绝对位置。
	 *					绝对位置必须要使用http://或是https://作为前缀。默认为:'./'
	 * @cfg {String} baseCssUrl (可选)该模块CSS资源的资源位置，它是基于运行上下文的相对位置，也可以是一个绝对位置。
	 *					绝对位置必须要使用http://或是https://作为前缀。默认等于baseUrl
	 * @cfg {Boolean} static (可选)等于true时，表示该模块以及该模块下的子模块采用的是全局命名空间(Namespace)形式开发的；
	 *					没有采用AMD形式。此时这些模块通过标识ID没有注册到运行环境中，要采用命名空间获取。默认为false；
	 * @cfg {String/Array} path (可选)引入该模块时首先要引入资源的路径。默认为undefined;
	 * @cfg {Boolean} norequire (可选，static等于true时有效)等于true时，表示该模块下的子模块都已经被配置的资源引入了，无须另行引入。默认为false；
	 * 
	 * @param {Context} ctx 该模块所在的运行上下文
	 * @param {Object} cfg 模块资源配置；具有的属性参考方法中@cfg注释
	 */
	PK.ModuleLoader = function(ctx, cfg){
		var me = this,
			module = isS(cfg.module) ? cfg.module : '',
			stc = (true === cfg['static']),
			norequire = (true === cfg['norequire']);
			
			
		me.config = cfg;
		me.context = ctx;
		
		/**
		 * @public
		 * 获得模块标识
		 */
		me.getModule = function(){
			return module;
		}
		/**
		 * @public
		 * 返回true表示该模块以及该模块下的子模块采用的是全局命名空间(Namespace)形式开发的；
		 * 没有采用AMD形式。此时这些模块通过标识ID没有注册到运行环境中，要采用命名空间获取。
		 * @return {Boolean}
		 */
		me.isStatic = function(){
			return stc;
		}
		
		/**
		 * @public
		 * 返回true时，表示该模块下的子模块都已经被配置的资源引入了，无须另行引入
		 * @return {Boolean}
		 */
		me.isNoRequire = function(){
			return norequire;
		}
		
		me.loaded = false;
		
		//已经下载过的模块
		me.loadedModules = {};
		//已经下载过CSS的模块
		me.loadedModuleCsses = {};
	}
	PK.ModuleLoader.prototype = {
		/**
		 * @public
		 * 加载指定模块相对应的JS脚本；
		 * 
		 * @param {String} module 模块标识
		 * @param {Function} callback 加载完毕后的回调方法;如果加载不成功，则传入false。否则传入true。
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		loadModule : function(module, callback, scope){
			var me = this;
			if(me.initing){
				return ;
			}
			if(me.isStatic()){
				me.doLoadModuleByStatic(module, callback, scope);
			}
			else{
				me.doLoadModuleByAmd(module, callback, scope);			
			}
		},
		/**
		 * @public
		 * 加载指定模块相对应的CSS文件；
		 * 
		 * @param {String} module 模块标识
		 * @param {Boolean/String/Array} cls 模块加载的CSS文件配置
		 *			等于true时，表示加载CSS文件与模块同在一个目录下。且名称与模块名一致。
		 *			为一个字符串时，表示加载一个CSS文件，其位置为基于一级模块源路径的相对位置路径或绝对位置路径。注意：绝对路径必须要添加http://或https://前缀
		 *			为一个数组时，表示要加载多个CSS文件；位置同一个文件的含义。
		 *			其他值表示无须加载CSS文件
		 */
		loadMoudleCss : function(module, cls){
			var me = this,
				c,src = false;
			if(!cls || me.isNoRequire()){
				Cmp.invoke(callback, scope, [true]);
				return ;
			}
			c = me.loadedModuleCsses[module];
			if(c){
				//加载过或正在加载；无需处理
				return ;
			} 
			me.loadedModuleCsses[module] = true;
				
				//下载
			if(true === cls){
				src = me.buildBasePathByModule(module, true);
				src = [src+'.css'];
			}
			else if(isS(cls)){
				src = [appendPath(me.baseCssDirectory, cls)];
			}
			else if(isA(cls)){
				src = [];
				for(var i=0,len = cls.length; i<len; i++){
					src[i] = appendPath(me.baseCssDirectory, cls[i]);
				}
			}
			RD.load(src);
		},
		/**
		 * @public
		 * 初始化该加载器
		 * <p>
		 * 初始化时，需要初始化以下内容
		 * <li>Step 1: 得到基本目录的绝对路径；
		 * <li>Step 2: 加载需要提前加载的资源；
		 * <li>Step 3: 将准备完成的标记置为true;
		 * <li>Step 4: 发送准备完成事件。
		 * </p>
		 */
		init : function(callback, scope){
			var me = this,
				cfg = me.config,
				ctx = me.context,
				path = cfg.path;
			
			
			me.onReady(callback, scope);
			
			//Step 1: 得到基本目录的绝对路径；
			me.baseDirectory = appendPath(ctx.getRootDirectory(), cfg.baseUrl);
			if(cfg.baseCssUrl){
				me.baseCssDirectory = appendPath(ctx.getRootDirectory(), cfg.baseCssUrl);
			}
			else{
				me.baseCssDirectory = me.baseDirectory;
			}
			
			//Step 2: 加载需要提前加载的资源；
			if(isS(path)){
				path = [path];
			}
			if(isA(path) && path.length > 0){
				for(var i=0, len = path.length; i<len; i++){
					path[i] = appendPath(me.baseDirectory, path[i]);
				}
				//加载资源
				ctx.inLoadModuleing = true;
				RD.load(path, me.onFrontResourceLoad, me);
			}
			else{
				me.onFrontResourceLoad();
			}
		},
	
		/**
		 * 返回true表示已经准备好。
		 */
		isReady : function(){
			return this.loaded;
		},
		/**
		 * 添加一个准备好的监听方法
		 * 
		 * @param {Function} l (必须)监听方法;调用时传入该上下文实例。
		 * @param {Object} scope (可选)调用监听方法时的this对象设定。默认为undefined
		 * @return this
		 */
		onReady : function(l, scope){
			var me = this;
			if(me.isReady()){
				Cmp.delayInvoke(l, scope, [me]);
			}
			else {
				if(!me.readyListeners){
					me.readyListeners = [];
				}
				me.readyListeners.push({
					fn : l,
					scope : scope
				});
			}
		},
		/**
		 * @private
		 * 前置资源加载完毕后的处理方法
		 * 由init方法调用，或者是在init方法
		 */
		onFrontResourceLoad : function(){
			//Step 3: 将准备完成的标记置为true;
			var me = this;
			me.context.inLoadModuleing = false;
			me.loaded = true;
			//Step 4: 发送准备完成事件。
			var ls = me.readyListeners,
				l,i=0,
				len = isA(ls) ? ls.length : 0;
			for(;i<len;i++){
				l = ls[i];
				Cmp.delayInvoke(l.fn, l.scope, [me]);
			}	
			delete me.readyListeners;
		},
		/**
		 * @private
		 * 加载命名空间类型的模块
		 * 
		 * @param {String} module 模块标识
		 * @param {Function} callback 加载完毕后的回调方法;如果加载不成功，则传入false。否则传入true。
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		doLoadModuleByStatic : function(module, callback, scope){
			var me = this,
				ms,m;
			if(me.isNoRequire()){
				//不采用依赖载入形式的；
				m = me.context.modules[module];
				if(m){
					m.setModulePrototype(true);
				}
				Cmp.invoke(callback, scope, [true]);
				return ;
			}
			//尝试是否已经加载过
			m = window,ms = module.split('.');
			while(m && ms.length > 0){
				m = m[ms.shift()];
			}
			if(m){
				//已经存在
				ms = me.context.modules[module];
				if(!ms){
					ms = new PK.Module(me.context, module);
					ms.instance = m;
					ms.ready = true;
					me.context.modules[module] = ms;
				}
				else{
					ms.setModulePrototype(true);
				}
				Cmp.invoke(callback, scope, [true]);
			}
			else{
				//加载代码
				me.addModuleLoadListener(module, callback, scope);
				if(!me.isLoadingForModule(module)){
					var src = me.buildBasePathByModule(module)+'.js';
					RD.load(src, function(dom){
						m = me.context.modules[module];
						if(m){
							m.setModulePrototype(true);
						}
						
						me.fireModuleLoadEvent(module, true);
					});
				}
			}
		},
		/**
		 * @private
		 * 加载AMD模式开发的模块
		 * 
		 * @param {String} module 模块标识
		 * @param {Function} callback 加载完毕后的回调方法;如果加载不成功，则传入false。否则传入true。
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		doLoadModuleByAmd : function(module, callback, scope){
			//TODO
			var me = this;
			me.addModuleLoadListener(module, callback, scope);
			if(!me.isLoadingForModule(module)){
				var src = me.buildBasePathByModule(module)+ (me.context.useMin ? '.min.js' : '.js');
				//var src = me.buildBasePathByModule(module)+'.js';
//				putLog('ModuleLoader#doLoadModuleByAmd> module:'+module+', js path:'+src);
				RD.load(src, function(dom){
//					putLog('ModuleLoader#doLoadModuleByAmd> module:'+module+', js loaed');
					me.fireModuleLoadEvent(module, true);
				});
			}
		},
		/**
		 * @private
		 * 询问指定是否正在加载;返回true表示正在加载。
		 */
		isLoadingForModule : function(module){
			var me = this,
				c = me.loadedModules[module];
			return c && !!c.loaded;
		},
		/**
		 * @private
		 * 添加指定模块加在完毕事件
		 */
		addModuleLoadListener : function(module, callback, scope){
			var me = this,
				c = me.loadedModules[module];
				
			if(!c){
				c = {
					success : false,
					loaded : false,
					loadListeners : []
				}
				me.loadedModules[module] = c;
			}	
			c.loadListeners.push({
				fn : callback,
				scope : scope
			});
		},
		/**
		 * @private
		 * 分发指定模块加载完毕事件
		 */
		fireModuleLoadEvent : function(module, success){
			var me = this,
				c = me.loadedModules[module];
			
			c.success = success;
			c.loaded = true;
			var ls = c.loadListeners,
				i=0,len = ls.length, l;
			for(;i<len;i++){
				l = ls[i];
				Cmp.invoke(l.fn, l.scope, c.success);
			}
		},
		/**
		 * 根据模块标识名，构建不带有后缀名的文件路径。
		 * @param {String} module 模块标志
		 */
		buildBasePathByModule : function(module, isCss){
			var me = this,
				meid = me.getModule(),
				ix = meid.length,
				src = module,
				ns;
			
			if(ix > 0){
				src = src.substring(ix);
			}
			ns = src.split('.');
			src = [];
			Cmp.each(ns, function(n){
				if(n){
					src.push(n);
				}
			});
			
			src = src.join('/');
			if(src.indexOf('/') === 0){
				src = src.substring(1);
			}
			
			return appendPath(
					true === isCss ? me.baseCssDirectory : me.baseDirectory, 
					src
				);	
		}
	};
}());
/**
 * @packge Cmp.req
 * @class Cmp.req.Context
 * @extend Object
 *
 * 引导代码运行时上下文类
 * 
 * @version 2.2.0
 * @since 2016-5-30
 * @author Jinhai
 */
(function(){

	var PK = Cmp.req,
		RLD = Cmp.util.ResourceLoader,
		PACKGE_NAME_REX = /^[a-z][a-z0-9]+$/,
		MODULE_NAME_REX = /^[A-Z][A-Za-z0-9]+$/;
	/**
	 * @private
	 * @static
	 * 延迟调用指定的监听器
	 */
	var delayInvokeListener = function(l, ctx){
		Cmp.delayInvoke(l.fn, l.scope, [ctx]);
	}

	/**
	 * @private
	 * 获取指定模块实例，并将模块实例通过回调方法返回
	 *
	 * @param {String} mid 模块标识
	 * @param {Function} cb 回调方法
	 */
	var requireModule = function(mid, cb){
		if(!isS(mid) || '' === mid){
			//无效的模块标识名
			cb(undefined);
			return ;
		}
		var me = this,
			m = me.modules[mid];
		if(m){
			//模块已经存在
			if(m.isReady()){
				cb(m.getInstance());
			}
			else{
				m.onReady(cb);
			}
		}
		else{
			//模块还不存在，只有先创建它然后当初始化完毕后
			m = new PK.Module(me, mid);
			me.modules[mid] = m;
			m.init(cb);
		}
	}

	/**
	 * @private
	 * 私有的请求模块方法；该方法不会检测Context是否准备好这个参数。
	 * @param {String/Array} modules 模块标识或这些标识组成的数组。
	 * @param {Function} callback 得到模块后的回调方法。参数为请求的模块
	 * @param {Object} scope 调用回调方法时的this对象设定。
	 */
	var doRequireModules = function(modules, callback, scope){
		//me.modules
		var me = this;
		if(isS(modules)){
			modules = [modules];
		}
		if(!isA(modules) || modules.length === 0){
			callback.call(scope);
		}
		var ms = [];
		
		var _requireModule = function(mid){
			requireModule.call(me, mid, function(m){
				ms.push(m);
				if(modules.length > 0){
					_requireModule(modules.shift());
				}
				else{
					callback.apply(scope, ms);
				}
			});
		}
		_requireModule(modules.shift());
	}
	
	/**
	 * 初始化传入的模块加载器
	 *
	 * @param {Array} loaders {ModuleLoader} 模块加载器对象组成的数组
	 * @param {Function} callback 加载完毕后调用的方法
	 * @param {Object} scope 调用方法的this对象设定
	 */
	var initModuleLoaders = function(loaders, callback, scope){
		if(!isA(loaders) || loaders.length === 0){
			Cmp.invoke(callback, scope);
		}
		else{
			loaders.shift().init(function(){
				initModuleLoaders.call(this, loaders, callback, scope);
			});
		}
	}
	
	/**
	 * 构建已经存在的模块;这些模块都是使用全局命名形式进行构建的
	 */
	var buildDefaultModules = function(context){
		var o = window.Cmp,so,smid;
		
		
		/**
		 * 创建模块实例
		 */
		var createModule = function(mid, mo){
			var	m = new PK.Module(context, mid);
			m.instance = mo;
			m.ready = true;
			return m;
		}
		var ms = {
			'Cmp' : createModule('Cmp', o)
		};
		/**
		 * @param {String} mid 模块标识
		 * @param {Object} mo 
		 */
		var putModules = function(mid,mo){
			for(i in mo){
				so = mo[i];
				smid = mid+'.'+i;
				if(isO(so)){
					if(PACKGE_NAME_REX.test(i)){
						//是一个功能包
						ms[smid] = createModule(smid, so);
						putModules(smid, so);
					}
					else if(MODULE_NAME_REX.test(i)){
						//是一个静态功能模块
						ms[smid] = createModule(smid, so);
					}
					else{
						//其他不收录
					}
				}
				else if(isF(so) && MODULE_NAME_REX.test(i)){
					//是一个方法，确定是否符合功能模块名称规范，如果符合则收录
					ms[smid] = createModule(smid, so);
				}
			}
		}
		putModules('Cmp', o);
		
		return ms;
	}
	
	
	
	/**
	 * @constructor
	 *
	 * @param {String} mainjs 主引导Javascript脚本的位置；
	 *			该位置可以设定为相对于当前页面地址的相对路径，如：'../js/startup.js'；
	 *				也可以设定绝对地址，如：http://coozw.jd.com/app/
	 */
	PK.Context = function(context){
		var me = this;
		
		me.mainJs = context.mainJs;
		me.useMin = context.useMin === 'true';
		me.ready = false;
		
		//所有模块的映射{moduleId:String > module:Module};
		me.modules = buildDefaultModules(me);
		me.moduleLoaders = {};
		me.defaultModuleLoader = new PK.ModuleLoader(me, {});
		
	} 
	PK.Context.prototype = {
		/**
		 * @public
		 * 初始化该上下文
		 * 该方法只能被调用一次，在第二次及之后的调用中，会直接调用回调方法；
		 *
		 * @param {Function} cb (可选)初始化完毕后，调用的方法。
		 * @param {Object} scope (可选)调用回调方法时的this对象设定。默认为undefined
		 */
		init : function(cb, scope){
//			putLog('Context#init>');
			var me = this;
			if(me.isReady()){
				Cmp.invoke(cb, scope);
			}
			else{
				//加载
				RLD.load(me.mainJs,me.onMainJsLoad, me);
			}
		},
		/**
		 * 加载指定模块的JS文件，加载完毕后，调用回调方法；
		 *
		 * @param {String} module 模块标识
		 * @param {Function} callback 加载完毕后的回调方法;如果加载不成功，则传入false。否则传入true。
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		loadModule : function(module, callback, scope){
//			putLog('Context#loadModule> module:'+module);
			var loader = this.getModuleLoader(module);
			loader.loadModule(module, callback, scope);
		},
		/**
		 * 装载指定模块的CSS文件
		 *
		 * @param {String} module 模块标识
		 * @param {Boolean/String/Array} cls 模块加载的CSS文件配置
		 *			等于true时，表示加载CSS文件与模块同在一个目录下。且名称与模块名一致。
		 *			为一个字符串时，表示加载一个CSS文件，其位置为基于一级模块源路径的相对位置路径或绝对位置路径。注意：绝对路径必须要添加http://或https://前缀
		 *			为一个数组时，表示要加载多个CSS文件；位置同一个文件的含义。
		 *			其他值表示无须加载CSS文件
		 */
		loadMoudleCss : function(module, cls){
			if(!module){
				//无须加载
				Cmp.invoke(callback, scope);
				return ;
			}
			var loader = this.getModuleLoader(module);
			loader.loadMoudleCss(module, cls);
		},
		/**
		 * 获得启动该上下文的主脚本位置; 
		 * 当该运行上下文还没有初始化完毕前，该方法返回值为undefined;
		 * @return {String} 主脚本位置位置链接；如：http://coozw.jd.com/app/js/Starup.js
		 */
		getRootPath : function(){
			return this.rootPath;
		},
		/**
		 * 获得该运行上下文的根目录; 
		 * 当该运行上下文还没有初始化完毕前，该方法返回值为undefined;
		 * @return {String} 根目录的位置链接；如：http://coozw.jd.com/app/js
		 */
		getRootDirectory : function(){
			return this.rootDirectory;
		},
		/**
		 * @public
		 * 返回true表示已经准备完毕。暨已经初始化完毕。
		 */
		isReady : function(){
			return this.ready;
		},
		/**
		 * @public
		 * 增加一个当初始化完毕后的监听方法。
		 *
		 * @param {Function} l (必须)监听方法;调用时传入该上下文实例。
		 * @param {Object} scope (可选)调用监听方法时的this对象设定。默认为undefined
		 */
		onReady : function(l, scope){
			if(!isF(l)){
				return ;
			}
			var me = this;
			if(me.isReady()){
				Cmp.invoke(l, scope, [me]);
			}
			else{
				if(!me.readyListeners){
					me.readyListeners = [];
				}
				me.readyListeners.push({
					fn : l,
					scope : scope
				});
			}
			return me;
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>配置模块引入资源的位置情况；
		 *
		 * @cfg {String} module (必须)模块标识；如果定义的是一级模块，则说明该模块下的子模块也是用该配置。除非它自己进行配置。
		 * @cfg {String} baseUrl (必须)该模块源代码的基本位置，它是基于运行上下文的相对位置，也可以是一个绝对位置。
		 *					绝对位置必须要使用http://或是https://作为前缀。
		 * @cfg {String} baseCssUrl (可选)该模块CSS资源的资源位置，它是基于运行上下文的相对位置，也可以是一个绝对位置。
		 *					绝对位置必须要使用http://或是https://作为前缀。默认等于baseUrl
		 * @cfg {Boolean} static (可选)等于true时，表示该模块以及该模块下的子模块采用的是全局命名空间(Namespace)形式开发的；
		 *					没有采用AMD形式。此时这些模块通过标识ID没有注册到运行环境中，要采用命名空间获取。
		 * @cfg {String/Array} path (可选)引入该模块时首先要引入资源的路径。
		 * @cfg {Boolean} norequire (可选)等于true时，表示该模块下的子模块都已经被配置的资源引入了，无须另行引入。
		 * 
		 * @param {Object/Array} cfgs 引入资源位置信息对象或者是这些对象组成的数组。每个对象具有的属性参考方法中的@cfg注释
		 * @param {Boolean} reload 等于true时表示如果当前已经装在了这个模块，则重新装载；否则不用再装载。默认为false;
		 * @return this
		 */
		config : function(cfg, reload){
			var me = this, m;
			if(isA(cfg)){
				Cmp.each(cfg, function(c){
					me.config(c);
				});
			}
			else if(isO(cfg) && isS(cfg.module)){
				if(!me.moduleLoaders[cfg.module] || true === reload){
					m = new PK.ModuleLoader(me, cfg);
					if(me.isReady()){
						m.init();
					}
					me.moduleLoaders[cfg.module] = m;
				}
			}	
			return me;
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>定义一个模块；在一个运行环境中，以模块为标识只能定义一个模块，当出现重复定义的时候，后来定义的模块要么覆盖原先定义的，要么被原先定义的覆盖。
		 * 
		 * @cfg {Function} factory (必须)模块工厂方法，用于生成模块；
		 *			如果返回一个对象，则表示定义模块为一个静态对象，可以直接使用。
		 *			如果返回一个方法，则表示定义的模块为一个构造方法，可以被实例化。
		 * 			调用工程方法时会传入扩展模块和依赖模块。
		 * @cfg {String} extend (可选)扩展模块标识
		 * @cfg {Array/String} requires (可选)依赖模块标识；依赖指的是显式调用的模块，而那些依赖模块所扩展或以依赖的可以不写。
		 * @cfg (Boolean/String/Array) cls (可选)该模块需要加载CSS标记；默认为false。
		 *			等于true时，表示加载CSS文件与模块同在一个目录下。且名称与模块名一致。
		 *			为一个字符串时，表示加载一个CSS文件，其位置为基于一级模块源路径的相对位置路径或绝对位置路径。注意：绝对路径必须要添加http://或https://前缀
		 *			为一个数组时，表示要加载多个CSS文件；位置同一个文件的含义。
		 * 
		 * 下面的代码为调用样例：
		 * <code>
		 * Cmp.define('App.Label',{
		 * 		//指定扩展模块
		 * 		extend : 'Cmp.Widget',
		 * 		//指定依赖模块: String/Array
		 * 		requires : undefined,
		 * 		//加载CSS配置：true表示需要加载同名样式，且与该脚本在同一个目录下
		 * 		cls : true,
		 * 		
		 * 		//模块工厂方法，用于生成具体模块
		 * 		factory : function(extendmodule, requireModules){
		 * 		//扩展已有类，返回方法
		 * 		return {
		 *			.....;// 实现略
		 * 		}
		 * 	});		
		 * </code>
		 * 
		 * @param {String} module (必须)模块标识名
		 * @param {Object} cfg (必须)模块配置对象;其属性参考方法中的@cfg注释
		 * @return this
		 */
		define : function(module, cfg){
//			putLog('Context#define> module:'+module);
			if(!isS(module) || '' === module){
				//不予处理
				return ;
			}
			var me = this,
				m = me.modules[module];
			if(m){
				//已经存在，判断是否已经初始化过，如果没有，则设定其原形。
				if(!m.isReady()){
					m.setModulePrototype(cfg);
				}
			}
			else{
				//不存在，则创建它
				m = new PK.Module(me, module);
				//加入属于模块包预加载标记位，表示无需加载其资源
				m.setModulePrototype(cfg, me.inLoadModuleing);			
				me.modules[module] = m;
			}
			return me;
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>请求指定的模块；并将模块通过回调方法传入。
		 * <p>
		 * 以下的代码为调用样例：
		 * <code>
		 * Cmp.require(
		 *		['App.Label','App.Dialog',,'App.chart.Grid'], 
		 *		function(lable, dig, grid){
		 *			...;//代码略
		 * 		}
		 *);
		 * </code>
		 * 
		 * @param {String/Array} module 模块标识或这些标识组成的数组。
		 * @param {Function} callback 得到模块后的回调方法。参数为请求的模块
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 * @return this
		 */
		require : function(module, callback, scope){
			var me = this;
//			putLog('Context#require>isReady:'+me.isReady()+', module:'+module);
			if(me.isReady()){
				doRequireModules.call(me, module, callback, scope);
			}
			else{
				if(!me.requireModules){
					me.requireModules = [];
				}
				me.requireModules.push({
					module : module,
					callback : callback,
					scope : scope
				});
			}
			return me;
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>创建指定模块的构造实例。并将这些实例通过回调方法传入。
		 * 只有所指定模块为一个构造方法时才能创建它的构造实例，并且这个构造方法只接受传入一个参数，且类型为对象；假如这个模块只是一个静态对象，那么只会返回这个静态对象。
		 * 
		 * <code>
		 * Cmp.create(
		 *		[{
		 *			module : 'App.chart.Grid', 	//必须的模块标识名
		 *			... 					//其他的模块构建实例配置属性。
		 *		},
		 *			'App.Label'					//模块标识名，此时创建的实例时的配置对象为undefined
		 *		], 
		 *		function(grid, label){
		 *			...;//代码略
		 * 		}
		 *);
		 * </code>
		 * 
		 * @param {String/Object/Array} module 模块标识或创建模块实例的配置对象
		 * @param {Function} callback 得到模块后的回调方法。参数为请求的模块
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		create : function(module, callback, scope){
//			putLog('Context#create>');
			
			if(!isA(module) && isO(module)){
				module = [module];
			}
			
			if(!isA(module) || module.length === 0){
				Cmp.invoke(callback, scope, []);
			}
			var me = this;
			//TODO
			var mids = [], 
				mcfgs = [],mc,
				i = 0,
				len = module.length;
			
			for(;i<len;i++){
				mc = module[i];
				if(isS(mc.module)){
					mids.push(mc.module);
					mcfgs.push(mc);
				}
			}
			
			if(mids.length > 0){
				me.require(mids, function(){
					var mois = arguments,
						mos = [],
						mo;
					//构建实例
					for(i=0,len = mois.length;i<len; i++){
						mo = mois[i];
						if(isF(mo)){
							mo = new mo(mcfgs[i]);
						}
						mos.push(mo);
					}
					
					//调用回调方法
					Cmp.invoke(callback, scope, mos);
				});
			}
			return me;
		},
		/**
		 * @private
		 * 主文件文件加载完毕后的处理方法
		 * <p>
		 * 加载完成后，需要执行以下几个步骤：
		 * <li>Step 1: 设置基本属性。</li>
		 * <li>Step 2: 初始化配置的模块加载器。</li>
		 * <li>Step 3: 将准备完成标记置为true;</li>
		 * <li>Step 4: 处理还未返回的请求模块</li>
		 * <li>Step 5: 发送onready事件</li>
		 * </p>
		 */
		onMainJsLoad : function(dom){
//			putLog('Context#onMainJsLoad>');
			var me = this,
				ms,
				i,len,
				m;
			//Step 1: 设置基本属性
//			putLog('Context#onMainJsLoad> mainjs src:'+dom[0].src);
			me.rootPath = m = dom[0].src;
			i = m.indexOf('?');
			if(i > 0){
				m = m.substring(0, i);
			}
			i = m.lastIndexOf('/');
			if(i > 0){
				m = m.substring(0, i);
			}
			//getRootDirectory
			me.rootDirectory = m;
//			putLog('Context#onMainJsLoad> rootPath:'+me.rootPath+', rootDirectory:'+me.rootDirectory);
			
			//Step 2: 初始化配置的模块加载器。
			ms = me.moduleLoaders;
			m = [me.defaultModuleLoader];
			for(i in ms){
				m.push(ms[i]);
			}
			initModuleLoaders.call(me, m, function(){
				//Step 3: 将准备完成标记置为true;
				me.ready = true;
				
				//Step 4: 处理还未返回的请求模块
				ms = me.requireModules;
				//还未处理请求模块
				for(i=0,len = isA(ms) ? ms.length : 0;i<len;i++){
					m = ms[i];
					doRequireModules.call(me, m.module, m.callback, m.scope);
				}	
				delete me.requireModules;
				
				//Step 5: 发送onready事件
				me.doFireReadyEvent();
			});
		}, 
		
		/**
		 * @private
		 * 对外发送准备完毕事件。
		 */
		doFireReadyEvent : function(){
			//TODO
			var me = this,
				ls = me.readyListeners,
				l;
				
			if(isA(ls)){
				while(ls.length > 0){
					delayInvokeListener(ls.shift(), me);	
				}
			}	
		},
		/**
		 * @private
		 * 获得指定模块的加载器
		 * @param {String} module 模块标识
		 * @return {ModuleLoader}
		 */
		getModuleLoader : function(module){
			var me = this,
				loaders = me.moduleLoaders,
				mid = module,
				ix,loader;
			
			loader = loaders[mid];
			while(!loader){
				ix = mid.lastIndexOf('.');
				if(ix < 0){
					break;
				}
				mid = mid.substring(0, ix);
				loader = loaders[mid];
			}
			
			if(!loader){
				//没有配置加载器，使用默认的加载器
				loader = me.defaultModuleLoader;
			}
			return loader;
		}
	};
}());
/**
 * @packge Cmp.req
 * @static Cmp.req.Require
 * AMD(异步加载模块)功能实现脚本;
 * 关于模块说明：
 * <h4>模块类型</h4>
 * <p>模块分成两类，一种为静态对象；另一种为可被实例话的构造方法。</p>
 * <h4>模块标识规范</h4>
 * <p>
 * <li> 模块标识在同一个运行环境下(Context)必须是唯一的，否则会造成模块混淆。</li>
 * <li> 标识名由26个大小写字符，10个数字以及分隔字符'.'组成。如：'App.chart.Grid'</li>
 * <li> 模块标识字符还代表该模块执行脚本的位置；如'App.chart.Grid'表示的执行脚本位置是在App一级模块源目录的char目录下，
 * js脚本名为Grid.js，同时CSS名为Grid.css(此为默认配置，CSS名可以在声明模块时进行修改)；</li>
 * </p>
 * <h4></h4>
 * 
 * @version 2.2.0
 * @since 2016-5-30
 * @author Jinhai
 */
(function(){

	var PK = Cmp.req,
		contexts = {},
		currentContext;
	
	
	var	REL = {
		/**
		 * @public
		 * 设定加载模块的模式;
		 * @param {Boolean} inLoad 资源加载模式标记
		 * 			等于true时表示加载文件过程中；对于此时声明的模块，无须自动加载依赖的资源；
		 * 			等于false时表示自动加载模式；此时对于声明的模块，需要分析是否已经家在所依赖的资源，并自动加载；
		 */
		setLoadModal : function(inLoad){
			if(currentContext){
				currentContext.inLoadModuleing = inLoad == true;
			}
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>配置模块引入资源的位置情况；
		 * 
		 * @param {Obejct/Array} cfgs 模块的引入资源配置对象或者是这些对象组成的数组。
		 * @see Cmp.req.Context#config();
		 */
		config : function(cfgs){
			if(currentContext){
				currentContext.config(cfgs);
			}	
		},
		/**
		 * @public
		 * @public
		 * <b>AMD规范方法</b>定义一个模块；
		 * 
		 * @param {String} module (必须)模块标识名
		 * @param {Object} cfg (必须)模块配置对象;其属性参考方法中的@cfg注释
		 * @see Cmp.req.Context#define();
		 */
		define : function(module, cfg){
			if(currentContext){
				currentContext.define(module, cfg);
			}
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>请求指定的模块；并将模块通过回调方法传入。
		 * 
		 * @param {String/Array} module 模块标识或这些标识组成的数组。
		 * @param {Function} callback 得到模块后的回调方法。参数为请求的模块
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		require : function(module, callback, scope){
			if(currentContext){
				currentContext.require(module, callback, scope);
			}
		},
		/**
		 * @public
		 * <b>AMD规范方法</b>创建指定模块的构造实例。并将这些实例通过回调方法传入。
		 * 只有所指定模块为一个构造方法时才能创建它的构造实例，并且这个构造方法只接受传入一个参数，且类型为对象；假如这个模块只是一个静态对象，那么只会返回这个静态对象。
		 * 
		 * @param {String/Object/Array} module 模块标识或创建模块实例的配置对象
		 * @param {Function} callback 得到模块后的回调方法。参数为请求的模块
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		create : function(module, callback, scope){
			if(currentContext){
				currentContext.create(module, callback, scope);
			}
		}
	
	};
		
	
	
	Cmp.req.Require = REL;
	Cmp.config = REL.config;
	Cmp.define = REL.define;
	Cmp.require = REL.require;
	Cmp.create = REL.create;
	Cmp.setLoadModal = REL.setLoadModal;
	
	/**
	 * 依次运行引入代码
	 */
	var doStartup = function(ms){
		if(isA(ms) && ms.length > 0){
			currentContext = new PK.Context(ms.shift());
			currentContext.init(function(){
				contexts[currentContext.getRootPath()] = currentContext;
				currentContext = undefined;
				doStartup(ms);
			});
		}
	}
	
	/**
	 * 启动AMD的运行环境
	 */
	var startup = function(){
		var dms = document.getElementsByTagName('script'),
			i=0, len = dms.length,
			mainJs,context, src,ms = [], useMin;
		for(;i<len;i++){
			context = {};
			mainJs = dms[i].getAttribute('main-js');
			useMin = dms[i].getAttribute('use-min');
//			if(isS(s)){
//				if(ms.indexOf(s) < 0){
//					ms.push(s);
//				}
//			}
			
			if (isS(mainJs)) {
				context.mainJs = mainJs;
            }
            if(isS(useMin)) {
            	context.useMin = useMin;
            }
            
            ms.push(context);
		}
		doStartup(ms);
	}
	
	Cmp.onReady(startup);
}());
/**
 * @protected
 * @module Cmp.ajax.Contants
 * Ajax的内部常用变量及方法；
 * 
 * @version 1.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
	
	var PARAM_NAME_REX = /^[A-Za-z][a-zA-Z0-9]*$/;
	
	/**
	 * 检测名称是否符合规则；返回true表示符合规则
	 */
	var checkParamName = function(n){
		return PARAM_NAME_REX.test(n);
	};
	
	var toValueStringForArray = function(arr){
		var i=0,len = arr.length,v,rel = [];
		for(;i<len;i++){
			v = toValueString(arr[i]);
			if(isS(v)){
				rel.push(v);
			}
		}
		return rel.join(',');
	}
	
	var toValueStringForString = function(v){
		return encodeURIComponent(v);
	}
	
	/**
	 * 将传入值转换为一个参数值的字符串；
	 */
	var toValueString = function(v){
		if(isS(v)){
			return toValueStringForString(v);
		}
		else if(isB(v)){
			return v ? 'true':'false';
		}
		else if(isN(v)){
			return ''+v;
		}
		else if(isD(v)){
			return v.format();
		}
		else if(isA(v)){
			return toValueStringForArray(v);
		}
		return false;
	}

	var Rel = {
		/**
		 * @static
		 * 数据访问成功且正确返回数据结果的编码值
		 */
		SUCCEED_CODE : 0,
		/**
		 * @static
		 * 数据请求服务端的未知错误的编码值
		 */
		SERVICE_UNKONW_ERROR : 100,
		
		/**
		 * @static
		 * 数据请求超时的编码值
		 */
		TIMEOUT_ERROR : 101,
		/**
		 * @static
		 * 数据请求时，给出的URL不可用编码值;如著名的404或400错误的
		 */
		UNAVAILABEL_ERROR : 102,
		/**
		 * @static
		 * 数据请求时，服务器端的内部错误编码值;如：503, 500,502错误；
		 */
		SERVER_ERROR : 103,
		/**
		 * @static
		 * 数据解析时的未知错误编码值；
		 */
		RESULT_ERROR : 200,
		/**
		 * @static
		 * 返回的结果无法按照JSON格式解析的错误编码值；
		 */
		RESULT_ERROR : 201,
		/**
		 * 指定对象转换为URL请求参数那样的字符串。
		 * 属性名只能为26个大小写英文字符和10个数字，不再范围内的将忽略；
		 * 而属性值对应的就是一个参数值，每种类型说明如下：
		 *		字符串类型{String} ：使用encodeURIComponent()方法进行编码
		 *		数字类型{Number} ：直接转换为字符串
		 *		布尔类型{Boolean} ：true对应为'true',false对应为:'false';
		 *		日期类型{Date} : 按照YYYY-MM-DD的格式转换为一个字符串，如果期望其他形式，需要自行转换为字符串
		 *		数组类型{Array} ：每一项的值类型必须是字符串、数字或布尔中的一种；
		 *		方法{Function} : 不支持
		 *		对象{Object} : 不支持
		 * @param {Object} o 需要解析的对象；如果传入为空，则返回空的字串； 
		 * @return {String} 请求参数字符串;如：a=1&b=2&c=3
		 */
		toParamString : function(o){
			if(!isO(o)){
				return '';
			}
			var n,v,rel = [];
			for(n in o){
				v = o[n];
				if(!checkParamName(n)		//参数名不符合规则
					|| (isO(v) && !isA(v) && !isD(v))	//是一个对象，且不是数组又不是Date
					|| isF(v)){				//是一个方法
					
					continue;
				}
				
				v = toValueString(v);
				if(isS(v)){
					rel.push(n+'='+v);
				}
			}
			
			return rel.join('&');
		}
	}
	
	Cmp.ajax.Contants = Rel;
	
}());
/**
 * @protected
 * @class Cmp.ajax.AjaxRequest
 * @extend Object
 * 采用原生Ajax形式实现的Ajax请求实现类；每一个类实例只能实现一次数据请求；
 *
 * <p>
 * 初始化时配置参数对象具有的属性如下：
 * @cfg {String} url (必须)发送请求的地址
 * @cfg {Boolean} async (可选)等于true时采用异步形式，否则为同步；默认为true;
 * @cfg {Boolean} usePost (可选)等于true时表示采用POST形式提交数据，某则为GET；默认为false。
 * @cfg {Function} callback (必须)回调方法；当成功获得数据或者是出现其他错误后，都会调用该方法；调用时传入参数如下：
 *				{Boolean} succeed 等于true时表示数据访问成功，且可以正确解析数据结果(当要求使用JSON格式解析时)； 
 *				{Object/String} result 返回结果字符串或对象(当要求使用JSON格式解析时)		
 *				{Number} code 执行结果编码；参考方法中的@code注释
 * @cfg {Object} params (可选)数据提交参数；是以名值对形式的对象实例；属性名只能为26个大小写英文字符和10个数字，不再范围内的将忽略；
 *					而属性值对应的就是一个参数值，每种类型说明如下：
 *						字符串类型{String} ：使用escape()方法进行编码
 *						数字类型{Number} ：直接转换为字符串
 *						布尔类型{Boolean} ：true对应为'true',false对应为:'false';
 *						日期类型{Date} : 按照YYYY-MM-DD的格式转换为一个字符串，如果期望其他形式，需要自行转换为字符串
 *						数组类型{Array} ：每一项的值类型必须是字符串、数字或布尔中的一种；
 *						方法{Function} : 不支持
 *						对象{Object} : 不支持
 * @cfg {Object} scope (可选)调用回调方法时的this对象设定
 * @cfg {String} type (可选)返回结果数据类型；可配置为(忽略大小写)：'text'|'xml'|'json'; 
 *							当配置为'text'时，会返回的原始字符串；
 *							当配置为'xml'时，会将返回的字符串结果按照XML解析；
 *							当配置为'json'时，会将返回的字符串结果按照JSON格式进行解析；
 *						 默认为'text'
 * @cfg {Number} timeout (可选)每次请求后的等待时间值，单位：秒；当超过此时间后将认为本次请求不成功；默认：30；
 * @cfg {Number} retryTimes (可选)每次请求失败后的重试次数；如果设定为0，则认为不去重试；默认为0；
 * </p>
 * 
 * @version 1.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
	/**
	 * @private
	 * @module Cmp.ajax.Contants
	 */
	var Contants = Cmp.ajax.Contants;
	//创建XMLHttpRequest对象
	var createHttpRequest = function(){
		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}
		else if (window.ActiveXObject){
			//低IE版本
			return new ActiveXObject("Microsoft.XMLHTTP");
		}	
		return undefined;
	}
	
	/**
	 * @construction
	 */
	var Request = function(cfg){
		var me = this;
		me.executed = false;
		me.config = {
			url : cfg.url,
			async : false === cfg.async ? false : true,
			usePost : cfg.usePost === true ? true : false,
			withCredentials : cfg.withCredentials,
			callback : cfg.callback,
			scope : cfg.scope,
			type : isS(cfg.type) ? cfg.type.toLowerCase() : 'text',
			timeout : isN(cfg.timeout) && cfg.timeout > 0 ? cfg.timeout*1000 : 30000,
			retryTimes : isN(cfg.retryTimes) && cfg.retryTimes > 0 ? cfg.retryTimes : 0,
			paramString : Contants.toParamString(cfg.params)
		};
		me.reqeustIndex = 0;
		me.timeoutTask = new Cmp.util.DelayedTask({
			handler : me.onTimeout,
			scope : me 
		});
	}
	Request.prototype = {
		/**
		 * 执行数据请求；如果已经执行过，则忽略本次调用
		 * @return {Boolean} 返回true表示开始请求数据
		 */
		execute : function(){
			var me = this;
			if(me.executed){
				return false;
			}
			me.doRequest();
		},
		/**
		 * @private
		 * 执行一次数据请求；
		 */
		doRequest : function(){
			var me = this,
				cfg = me.config,
				rq = createHttpRequest(),
				url = [cfg.url],
				ix = me.reqeustIndex;
			
			if(!cfg.usePost){
				if(cfg.url.indexOf('?') < 0){
					url.push('?');
				}
				url.push('&_rbtv='+new Date().getTime());
				
				if(cfg.paramString){
					url.push('&');
					url.push(cfg.paramString);
				}
			} 
			if(cfg.withCredentials){
				rq.withCredentials = true;
			}
			
			rq.onreadystatechange = function(){
				if(rq.readyState == 4){
					if(ix == me.reqeustIndex){
						me.timeoutTask.cancel();
						if(rq.status==200){
							me.onSccceed(rq);
						}
						else{
							me.onError(rq.status);
						}
					}
				}
			}
			rq.open(
				cfg.usePost ? 'POST' : 'GET',
				url.join(''),
				cfg.async
			);
			if(cfg.usePost){
				rq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				rq.send(cfg.paramString);
			}
			else{
				rq.send();
			}
			me.timeoutTask.run({
				delay : cfg.timeout
			});		
		},
		/**
		 * @private
		 * 超时后的处理方法；
		 */
		onTimeout : function(){
			var me = this,
				ix = me.reqeustIndex,
				cfg = me.config;	
			me.reqeustIndex = ix+1;
			
			if(ix < cfg.retryTimes){
				//允许重新获取
				me.doRequest();
			}
			else{
				Cmp.invoke(cfg.callback, cfg.scope, [{
					code : Contants.TIMEOUT_ERROR
				}]);
			}
			
		},
		/**
		 * @private
		 * 成功接受到数据后的处理
		 */
		onSccceed : function(rq){
			var me = this,
				cfg = me.config,
				code = Contants.SUCCEED_CODE,
				rs;
			
			if('xml' == cfg.type){
				try{
					rs = rq.responseXML;
				}
				catch(ex){
					code = Contants.RESULT_ERROR;
				}
			}
			else if('json' == cfg.type){
				rs = rq.responseText;
				try{
					rs = eval('('+rs+')');
				}
				catch(ex){
					rs = undefined;
					code = Contants.RESULT_ERROR;
				}
			}
			else{
				rs = rq.responseText;
			}
			me.executed = true;
			Cmp.invoke(cfg.callback, cfg.scope, [{
				code : code,
				result : rs
			}]);
		},
		onError : function(status){
			var me = this,
				cfg = me.config,
				code = Contants.SERVICE_UNKONW_ERROR;
			me.executed = true;
			if(status >= 500){
				//服务器错误
				code = Contants.SERVER_ERROR;
			}
			else{
				code = Contants.UNAVAILABEL_ERROR;
			}
			
			Cmp.invoke(cfg.callback, cfg.scope, [{
				code : code
			}]);
		}
	};
	
	Cmp.ajax.AjaxRequest = Request;
}());
/**
 * @protected
 * @class Cmp.ajax.JsonpRequest
 * @extend Object
 * 采用原JSONP形式实现的Ajax请求实现类；每一个类实例只能实现一次数据请求；
 *
 * <p>
 * 初始化时配置参数对象具有的属性如下：
 * @cfg {String} url (必须)发送请求的地址
 * @cfg {Boolean} async (可选)等于true时采用异步形式，否则为同步；默认为true;
 * @cfg {Function} callback (必须)回调方法；当成功获得数据或者是出现其他错误后，都会调用该方法；调用时传入参数如下：
 *				{Boolean} succeed 等于true时表示数据访问成功，且可以正确解析数据结果(当要求使用JSON格式解析时)； 
 *				{Object/String} result 返回结果字符串或对象(当要求使用JSON格式解析时)		
 *				{Number} code 执行结果编码；参考方法中的@code注释
 * @cfg {Object} scope (可选)调用回调方法时的this对象设定
 * @cfg {String} type (可选)返回结果数据类型；可配置为(忽略大小写)：'text'|'xml'|'json'; 
 *							当配置为'text'时，会返回的原始字符串；
 *							当配置为'xml'时，会将返回的字符串结果按照XML解析；
 *							当配置为'json'时，会将返回的字符串结果按照JSON格式进行解析；
 *						 默认为'text'
 * @cfg {Number} timeout (可选)每次请求后的等待时间值，单位：秒；当超过此时间后将认为本次请求不成功；默认：30；
 * @cfg {Number} retryTimes (可选)每次请求失败后的重试次数；如果设定为0，则认为不去重试；默认为0；
 * </p>
 * 
 * @version 1.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
	/**
	 * @private
	 * @module Cmp.ajax.Contants
	 */
	var Contants = Cmp.ajax.Contants;
	var	DomHelper = Cmp.util.DomHelper;
	
	var CHARTS = [
		'a','b','c','d','e','f','g',
		'h','i','j','k','l','m','n',
		'o','p','q','r','s','t',
		'u','v','w','x','y','z',
		'A','B','C','D','E','F','G',
		'H','I','J','K','L','M','N',
		'O','P','Q','R','S','T',
		'U','V','W','X','Y','Z'
	];
	
	/**
	 * @private
	 * 创建回调方法名;
	 * 'jb'+[当前时间组成的进制字符]
	 */
	var createFunctionName = function(){
		var len = CHARTS.length,
			date = new Date().getTime(),
			ix,
			rel = [];
		
		//时间标记
		while(date > 0){
			ix = date%len;
			rel.unshift(CHARTS[ix]);
			date = Math.floor(date/len);
		}
		
		//随机字符串
		for(var i=0;i < 3;i++){
			ix = Math.floor(Math.random()*CHARTS.length);
			rel.unshift(CHARTS[ix]);
		}
		
		//固化字符
		rel.unshift('jb');
		return rel.join('');
	}
	
	/**
	 * @private
	 * 执行一次JSONP请求
	 * @param {String} url 请求的URL
	 * @param {Function} callback 成功获得数据后的回调方法
	 * @param {Number} timeout 超时时间
	 * @param {Function} timeoutCb 超时后调用方法
	 */
	var doJsonpRequest= function(url, callback, timeout, timeoutCb){
		var win  = window,
			body = document.body,
			fnm = createFunctionName(),
			src = [url],
			sdom,
			loadding;
		
		if(url.indexOf('?') < 0){
			src.push('?');
		}
		src.push('&callback=');
		src.push(fnm);
		
		/**
		 * 清空因数据请求而创建的资源 
		 */
		var clear = function(){
			//删除创建的script节点
			if(sdom && sdom.parentNode){
				sdom.parentNode.removeChild(sdom);
			}
			
			//删除创建的回调方法
			delete win[fnm];
		}
		
		//创建全局回调方法
		win[fnm] = function(rs){
			clear();
			if(loadding){
				loadding = false;
				//调用传入的回调方法
				Cmp.invoke(callback, window, [rs]);
			}
		}
		loadding = true;	
		sdom = DomHelper.createDom({
			tag : 'script',
			atts : {
				type : 'text/javascript',
				src : src.join('')
			},
			parentNode : body
		});	
		//超时保护
		window.setTimeout(function(){
			clear();
			if(loadding){
				loadding = false;
				//调用传入的回调方法
				Cmp.invoke(timeoutCb, undefined, []);
			}
		}, timeout);
	}
	
	/**
	 * @construction
	 */
	var Request = function(cfg){
		var me = this;
		me.executed = false;
		//拼接URL
		var url = [cfg.url],
			v;

		if(cfg.url.indexOf('?') < 0){
			url.push('?');
		}
		
		v = Contants.toParamString(cfg.params);
		if(isS(v)){
			url.push('&');
			url.push(v);
		}
		
		me.config = {
			url : url.join(''),
			callback : cfg.callback,
			scope : cfg.scope,
			timeout : isN(cfg.timeout) && cfg.timeout > 0 ? cfg.timeout*1000 : 30000,
			retryTimes : isN(cfg.retryTimes) && cfg.retryTimes > 0 ? cfg.retryTimes : 0,
			type : isS(cfg.type) ? cfg.type.toLowerCase() : 'text'
		};
	}
	Request.prototype = {
		/**
		 * 执行数据请求；如果已经执行过，则忽略本次调用
		 * @return {Boolean} 返回true表示开始请求数据
		 */
		execute : function(){
			var me = this;
			if(me.executed){
				return ;
			}
			me.doRequest();
		},
		/**
		 * @private
		 * 执行一次数据请求；
		 */		
		doRequest : function(){
			var me = this,
				cfg = me.config,
				url = cfg.url;
			//无需为参数增加随机数字，因为在后续添加callback参数时，已经增加了关于时间的字符戳
			
			if(isN(me.reqeustIndex)){
				me.reqeustIndex = me.reqeustIndex+1;
			}
			else{
				me.reqeustIndex = 0;
			}
			
			
			doJsonpRequest(url, 
				//成功方法
				function(rs){
					me.onSccceed(rs);
				},
				//超时时间
				cfg.timeout,
				//超时时处理方法
				function(){
					me.onTimeout();
				}
			);
		},
		/**
		 * @private
		 * 超时后的处理方法；
		 */
		onTimeout : function(){
			var me = this,
				ix = me.reqeustIndex,
				cfg = me.config;
			if(ix < cfg.retryTimes){
				//允许重新获取
				me.doRequest();
			}
			else{
				Cmp.invoke(cfg.callback, cfg.scope, [{
					code : Contants.TIMEOUT_ERROR
				}]);
			}
		},
		/**
		 * @private
		 * 成功接受到数据后的处理
		 */
		onSccceed : function(rs){
			var me = this,
				cfg = me.config,
				code = Contants.SUCCEED_CODE,
				vo = rs;
			
			me.executed = true;
			if('json' == cfg.type){
				//期望返回对象
				if(isS(rs)){
					try{
						if(JSON && isF(JSON.parse)){
							vo = JSON.parse(rs);
						}
						else{
							vo = eval('('+rs+')');
						}
					}
					catch(ex){
						vo = undefined;
						code = Contants.RESULT_ERROR;
					}
				}
			}
			
			Cmp.invoke(cfg.callback, cfg.scope, [{
				code : code,
				result : vo
			}]);
		},
	};
	
	Cmp.ajax.JsonpRequest = Request;
	
}());
/**
 * @public
 * @module Cmp.ajax.Ajax
 * Ajax的对外开放模块工具；
 * 
 * <p>
 * 该工具用于替换Cmp.util.AjaxProxy 工具类那个比较简单的功能；其接口更加单一化；支持的功能更多：
 * <li>支持采用JSONP协议(新增)</li>
 * <li>支持超时后重连(之前为全局配置模式)</li>
 * <li>支持GET/POST两种数据提交方式</li>
 * <li>可以直接对返回结果按照JSON格式解析，并返回解析后对象。</li>
 * </p>
 * 
 * @version 1.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
	/**
	 * @private
	 */
	var AjaxRequest = Cmp.ajax.AjaxRequest,
		JsonpRequest = Cmp.ajax.JsonpRequest;

	var Rel = {
		/**
		 * @static
		 * 
		 * 执行Ajax的请求操作；
		 *
		 * <p>
		 * 选项对象设定属性说明如下：
		 * @option {String} url (必须)发送请求的地址
		 * @option {Boolean} usePost (可选)等于true时表示采用POST形式提交数据，某则为GET；默认为false。当采用JSONP形式时，一律采用GET； 
		 * @option {Function} callback (必须)回调方法；当成功获得数据或者是出现其他错误后，都会调用该方法；调用时传入参数如下：
		 *				{Object/String} result 返回结果字符串或对象(当要求使用JSON格式解析时)		
		 *				{Number} code 执行结果编码；参考方法中的@code注释
		 * @option {Object} params (可选)数据提交参数；是以名值对形式的对象实例；属性名只能为26个大小写英文字符和10个数字，不再范围内的将忽略；
		 *					而属性值对应的就是一个参数值，每种类型说明如下：
		 *						字符串类型{String} ：使用encodeURIComponent()方法进行编码
		 *						数字类型{Number} ：直接转换为字符串
		 *						布尔类型{Boolean} ：true对应为'true',false对应为:'false';
		 *						日期类型{Date} : 按照YYYY-MM-DD的格式转换为一个字符串，如果期望其他形式，需要自行转换为字符串
		 *						数组类型{Array} ：每一项的值类型必须是字符串、数字或布尔中的一种；
		 *						方法{Function} : 不支持
		 *						对象{Object} : 不支持
		 * @option {Object} scope (可选)调用回调方法时的this对象设定
		 * @option {Boolean} async (可选)等于true时采用异步形式，否则为同步；默认为true;
		 * @option {String} type (可选)返回结果数据类型；可配置为(忽略大小写)：'text'|'xml'|'json'; 
		 *							当配置为'text'时，会返回的原始字符串；
		 *							当配置为'xml'时，会将返回的字符串结果按照XML解析；采用JSONP形式时不支持此选项，届时还是采用text返回；
		 *							当配置为'json'时，会将返回的字符串结果按照JSON格式进行解析；
		 *						 默认为'text'
		 * @option {Number} timeout (可选)每次请求后的等待时间值，单位：秒；当超过此时间后将认为本次请求不成功；默认：30；
		 * @option {Number} retryTimes (可选)每次请求失败后的重试次数；如果设定为0，则认为不去重试；默认为0；
		 * @option {Boolean} jsonpMode (可选)采用JSONP形式访问数据；默认为false;
		 * </p>
		 *  
		 * <p>
		 * 执行结果编码说明如下：
		 * @code 0 : 数据访问成功且正确返回数据结果
		 * @code 100 : 数据请求服务端的未知错误
		 * @code 101 : 数据请求超时
		 * @code 102 : 数据请求时，给出的URL不可用；如著名的404或400错误；
		 * @code 103 : 数据请求时，服务器端的内部错误，如：503, 500,502错误；
		 * @code 200 ：数据解析时的未知错误
		 * @code 201 : 返回的结果无法按照JSON格式解析；
		 * </p>
		 * 
		 * @param {Object} option (必须) 数据请求配置项；其属性参考@option 注释；
		 * @return {Boolean} 返回true表示开始请求数据
		 */
		request : function(option){
			if(!isO(option)
				|| !isS(option.url)
				|| !isF(option.callback)){
				//参数检测
				return false;
			}
			var req;
			if(true === option.jsonpMode){
				req = new JsonpRequest(option);
			}
			else{
				req = new AjaxRequest(option);
			}
			
			return req.execute();
		}
	};
	
	
	Cmp.ajax.Ajax = Rel;
}());
/**
 * @class Cmp.ajax.AjaxWorker
 * 通过Ajax定时访问后台获取数据的实现类; 该类是对Ajax工具模块进行了一层封装。
 * 
 * @cfg {Number} delay (可选)接收并调用回调方法后，下一次请求数据的延迟时间，单位：妙。该延迟时间必须大于5。当小于该值时，将不会再次进行数据请求。
 * @cfg {String} url (可选)发送请求的地址;NOTE:此参数虽然未可选参数，但要保证执行run方法时，可以得到该属性值
 * @cfg {Boolean} usePost (可选)等于true时表示采用POST形式提交数据，某则为GET；默认为false。当采用JSONP形式时，一律采用GET； 
 * @cfg {Function} callback (必须)回调方法；当成功获得数据或者是出现其他错误后，都会调用该方法；调用时传入参数如下：
 *				{Object/String} result 返回结果字符串或对象(当要求使用JSON格式解析时)		
 *				{Number} code 执行结果编码；参考@code注释
 * @option {Object} params (可选)数据提交参数；是以名值对形式的对象实例；属性名只能为26个大小写英文字符和10个数字，不再范围内的将忽略；
 *					而属性值对应的就是一个参数值，每种类型说明如下：
 *						字符串类型{String} ：使用encodeURIComponent()方法进行编码
 *						数字类型{Number} ：直接转换为字符串
 *						布尔类型{Boolean} ：true对应为'true',false对应为:'false';
 *						日期类型{Date} : 按照YYYY-MM-DD的格式转换为一个字符串，如果期望其他形式，需要自行转换为字符串
 *						数组类型{Array} ：每一项的值类型必须是字符串、数字或布尔中的一种；
 *						方法{Function} : 不支持
 *						对象{Object} : 不支持
 * @option {Object} scope (可选)调用回调方法时的this对象设定
 * @option {Boolean} async (可选)等于true时采用异步形式，否则为同步；默认为true;
 * @option {String} type (可选)返回结果数据类型；可配置为(忽略大小写)：'text'|'xml'|'json'; 
 *							当配置为'text'时，会返回的原始字符串；
 *							当配置为'xml'时，会将返回的字符串结果按照XML解析；采用JSONP形式时不支持此选项，届时还是采用text返回；
 *							当配置为'json'时，会将返回的字符串结果按照JSON格式进行解析；
 *						 默认为'text'
 * @option {Number} timeout (可选)每次请求后的等待时间值，单位：秒；当超过此时间后将认为本次请求不成功；默认：30；
 * @option {Number} retryTimes (可选)每次请求失败后的重试次数；如果设定为0，则认为不去重试；默认为0；
 * @option {Boolean} jsonpMode (可选)采用JSONP形式访问数据；默认为false;
 * 
 * <p>
 * 执行结果编码说明如下：
 * @code 0 : 数据访问成功且正确返回数据结果
 * @code 100 : 数据请求服务端的未知错误
 * @code 101 : 数据请求超时
 * @code 102 : 数据请求时，给出的URL不可用；如著名的404或400错误；
 * @code 103 : 数据请求时，服务器端的内部错误，如：503, 500,502错误；
 * @code 200 ：数据解析时的未知错误
 * @code 201 : 返回的结果无法按照JSON格式解析；
 * </p>
 * 
 * @version 1.0.0
 * @since 2016-11-31
 * @author Jinhai
 */
(function(){

	/**
	 * @private
	 * @class 
	 * @construction
	 * 执行器
	 */
	var Runner = function(option, def){
		var me = this,
			baseUrl = isS(option.url) ? option.url : def.url,
			callback = isF(option.callback) ? option.callback : def.callback,
			scope = option.scope || def.scope,
			delay = isN(option.delay) ? option.delay : (isN(def.delay) ? def.delay : false),
			task,ajaxOption,
			disabled = false;
			
			
		if(!isS(baseUrl)){
			throw new Error('因缺少请求地址而无法执行。');
		}
		
		//Ajax接收到数据后的处理方法
		var ajaxResponse = function(rs){
			if(!disabled){
				Cmp.invoke(callback, scope, [rs]);
				if(task){
					task.run();
				}
			}
		}
		
		ajaxOption = {
			url : baseUrl,
			usePost : option.usePost || def.usePost,
			params : option.params || def.params,
			async : isB(option.async) ? option.async : def.async,
			type : isS(option.type) ? option.type : def.type,
			timeout : isN(option.timeout) ? option.timeout : def.timeout,
			retryTimes : isN(option.retryTimes) ? option.retryTimes : def.retryTimes,
			jsonpMode : isB(option.jsonpMode) ? option.jsonpMode : def.jsonpMode,
			callback : ajaxResponse,
			scope : me
		};

		
		
		//实际执行数据请求
		var doRequest = function(){
			if(disabled){
				return ;
			}
			Cmp.ajax.Ajax.request(ajaxOption);
		}//End doRequest
		
		
		if(delay && delay >= 5 ){
			task = new Cmp.util.DelayedTask({
				handler : doRequest,
				scope : me
			});
		}
			
		
	
	
	
		//开始执行
		me.start = function(){
			doRequest();
		}
		//停止执行
		me.stop = function(){
			disabled = true;
			if(task){
				task.cancel();
				task = undefined;
			}
		}
	}
	
	/**
	 * @construction
	 */
	var AjaxWorker = function(cfg){
		var me = this;
		me.defaultConfig = cfg || {};
		me.running = false;
		
	}
	
	AjaxWorker.prototype = {
		/**
		 * 返回true表示当前正处于数据查询状态，或等待下次数据请求状态中。
		 */
		isRun : function(){
			return this.running;
		},
		/**
		 * 开始执行数据请求。
		 * 
		 * @param {Object} option 配置参数，实际执行远程服务调用时的增补参数。在实际调用Ajax时需要一些必须参数(可参考构造方法中的参数说明)；
		 *			而该配置参数为优先配置参数，没有配置的则有创建该实例时的配置参数补充。
		 *	
		 */
		run : function(option){
			var me = this;
			me.cancel();
			me.runner = new Runner(option, me.defaultConfig);
			//调用
			me.running = true;
			me.runner.start();
		},
		/**
		 * 取消数据请求。
		 * 如果当前处于数据请求状态，则取消本次数据；如果出于等待下次数据查询，则阻止。
		 */
		cancel : function(){
			var me = this;
			me.running = false;
			if(me.runner){
				me.runner.stop();
			}
			delete me.runner;
		},
		/**
		 * 销毁该数据请求实例；等同于调用cancel方法;
		 * 无论当前是否处于执行状态中，一律取消。
		 */
		destroy : function(){
			this.cancel();
		}
	};
	
	Cmp.ajax.AjaxWorker = AjaxWorker; 
}());
