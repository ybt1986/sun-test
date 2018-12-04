/**
 * @static Cmp.util.Dates
 * 对于日期处理的一些工具方法
 * 
 * @version 1.0.0
 * @since 2016-6-10
 * @author Jinhai
 */
(function(){


	var Rel = {
		/**
		 * 将日期对象转换为一个符合中文习惯的表示日期的字符串；如：2016年06月18日
		 *
		 * @param {Date} date (必须)日期对象
		 * @return {String} 
		 */
		toDateStringForCh : function(date){
			if(!isD(date)){
				return '';
			}
			var rel = [],v;
			//年
			rel.push(date.getFullYear());	
			rel.push('年');
			//月 
			v = date.getMonth()+1;
			if(v < 10){
				rel.push('0');	
			}
			rel.push(v);
			rel.push('月');
			//日
			v = date.getDate();
			if(v < 10){
				rel.push('0');	
			}
			rel.push(v);
			rel.push('日');
			return rel.join('');
		},
		/**
		 * 将日期对象转换为一个符合中文习惯的表示月份的字符串；如：2016年06月
		 * @param {Date} date (必须)日期对象
		 * @return {String} 
		 */
		toMonthStringForCh : function(date){
			if(!isD(date)){
				return '';
			}
			var rel = [],v;
			//年
			rel.push(date.getFullYear());	
			rel.push('年');
			//月 
			v = date.getMonth()+1;
			if(v < 10){
				rel.push('0');	
			}
			rel.push(v);
			rel.push('月');
			return rel.join('');
		},
		/**
		 * 将日期对象转换为通用标准(暨'YYYY-MM-DD')格式的字符串
		 * @param {Date} date (必须)日期对象
		 * @return {String} 
		 */
		toDateString : function(date){
			if(!isD(date)){
				return '';
			}
			var rel = [],v;
			//年
			rel.push(date.getFullYear());	
			//月 
			rel.push('-');
			v = date.getMonth()+1;
			if(v < 10){
				rel.push('0');	
			}
			rel.push(v);
			//日
			rel.push('-');
			v = date.getDate();
			if(v < 10){
				rel.push('0');	
			}
			rel.push(v);
			return rel.join('');
		},
		/**
		 * 获得指定月份的天数量
		 * @param {Number} year (必须)公历年份值，如：2016
		 * @param {Number} month (必须)月份值，1月份得值等于0；12月份的值等于11； 
		 */
		getDaysOfMonth : function(year, month){
			switch(month){
				//四月
				case 3:
				//六月
				case 5:
				//九月
				case 8:
				//十一月
				case 10:
					return 30;
				//二月份	
				case 1:
					if(0 === year % 400 || (0 !== year % 100 && 0 === year % 4)){
						//闰年
						return 29;
					}
					else{
						//平年
						return 28;
					}
				//一，三，五，七，八，十，十二月份	
				default :
					return 31	
			}
		}
	};
	
	Cmp.define('Cmp.util.Dates',{
		factory : function(){
			return Rel;
		}
	
	});
}());