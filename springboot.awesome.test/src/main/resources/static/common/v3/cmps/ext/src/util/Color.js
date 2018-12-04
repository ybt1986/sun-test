/**
 * 对于颜色值得数据描述
 * 
 * @class Cmp.util.Color
 * @extend Object
 * 
 * @version 1.0.0
 * @since 2016-03-30
 * @author Jinhai 
 */
(function(){

	var VU = Cmp.util.ValueHelper;
	
	/**
	 * 解析一个字符串，然后返回一个表示颜色值的数组
	 * @reutrn {Array} 结构为[r,g,b,a]的数组； 如果不能解析，则返回false;
	 */
	var parse = function(s){
		s = s.toLowerCase();
		if(s.indexOf('#') === 0){
			return parseWeb(s);
		}
		else if(s.index('rgb(') === 0){
			return parseRgb(s);
		}
		else if(s.index('rgba(') === 0){
			return parseRgba(s);
		}
		
		return false;
	}
	/**
	 * 解析以'#'开头的字符串颜色
	 * @reutrn {Array} 结构为[r,g,b,a]的数组； 如果不能解析，则返回false;
	 */
	var parseWeb = function(s){
		s = s.substring(1);
		if(s.length !== 3 && s.length !== 6){
			return false;
		}
		
		var v = parseInt(s, 16),
			r,g,b;
		if(false === v){
			return v;
		}
		if(s.length === 3){
			r = (0xF00 & v) >> 8;
			r = (r << 4) + r;
			g = (0x0F0 & v) >> 4;
			g = (g << 4) + g;
			b = (0x00F & v);
			b = (b << 4) + b;
		}
		else {
			r = (0xFF0000 & v) >> 16;
			g = (0x00FF00 & v) >> 8;
			b = 0x0000FF & v;
		}
		
		return [r,g,b,100];
	}
	/**
	 * 解析以'rgb('开头的字符串颜色
	 * @reutrn {Array} 结构为[r,g,b,a]的数组； 如果不能解析，则返回false;
	 */
	var parseRgb = function(s){
		s = s.substring(4);
		var ix = s.indexOf(')');
		if(ix > -1){
			s = s.substring(0, ix);
		}
		var vs = s.split(',');
		if(vs.length != 3){
			return false;
		}
		var r = VU.toInteger(vs[0], false),
			g = VU.toInteger(vs[1], false),
			b = VU.toInteger(vs[2], false);
		if(false === r || false === g || false === b){
			return false;
		}	
		r = 0xFF & r;
		g = 0xFF & g;
		b = 0xFF & b;
		return [r,g,b,100];
	}
	/**
	 * 解析以'rgba('开头的字符串颜色
	 * @reutrn {Array} 结构为[r,g,b,a]的数组； 如果不能解析，则返回false;
	 */
	var parseRgba = function(s){
		s = s.substring(5);
		var ix = s.indexOf(')');
		if(ix > -1){
			s = s.substring(0, ix);
		}
		var vs = s.split(',');
		if(vs.length != 4){
			return false;
		}
		var r = VU.toInteger(vs[0], false),
			g = VU.toInteger(vs[1], false),
			b = VU.toInteger(vs[2], false),
			a = VU.toFloat(vs[3], false);
		if(false === r || false === g || false === b 
			|| false === a){
			return false;
		}	
		r = 0xFF & r;
		g = 0xFF & g;
		b = 0xFF & b;
		a = Math.round(a*100) % 101;
		
		return [r,g,b,a];
	}
	/**
	 * 创建颜色数据实例
	 * @param {String/Number} r 当为一个字符串时，为颜色的初始设定值，如果不能解析，则默认为一个#808080颜色；
	 *						当为一个数值时，则认为是颜色中红色值，取值范围为0~255;对于所有溢出的值，都按照进行求模计算出。
	 * @param {Number} g 颜色中的绿色值；当参数r为一个字符串时，此参数无效。取值范围为0~255;对于所有溢出的值，都按照进行求模计算出。默认为128；
	 * @param {Number} b 颜色中的蓝色值；当参数r为一个字符串时，此参数无效。取值范围为0~255;对于所有溢出的值，都按照进行求模计算出。默认为128；
	 * @param {Number} a 透明度设定，0为完全透明，100为完全不透明；取值范围0~100；默认为100；
	 */
	var Color = function(r, g, b, a){
		var me = this,
			red = 128,
			greed = 128,
			blue = 128,
			alpha = 100;
		
		/**
		 * 获得红色值
		 * @return {Number} 0~255的数值
		 */
		me.getRed = function(){
			return red;
		}
		/**
		 * 获得绿色值
		 * @return {Number} 0~255的数值
		 */
		me.getGreen = function(){
			return greed;
		}
		/**
		 * 获得蓝色值
		 * @return {Number} 0~255的数值
		 */
		me.getBlue = function(){
			return blue;
		}
		/**
		 * 获得透明度设定值
		 *　@return {Number} 0~100的数值；0为完全透明，100为完全不透明；
		 */
		me.getAlpha = function(){
			return alpha;
		}
		
			
		if(isS(r)){
			var vs = parse(r);
			if(vs){
				red = vs[0];
				greed = vs[1];
				blue = vs[2];
				alpha = vs[3];
			}
		}
		else if(isN(r)){
			red = r % 256;
			greed = isN(g) ? g % 256 : 128;
			blue = isN(b) ? b % 256 : 128;
			alpha = isN(a) ? a % 101 : 100;
		}
		else{
			//默认值，不再作处理。
		}
	}
	
	Color.prototype = {
		/**
		 * @overwrite
		 */
		valueOf : function(){
			var me = this,
				a = me.getAlpha();
			var v = me.getRed() << 16 + me.getGreen() << 8 + me.getBlue();
			if(a === 100){
				v = v + (255 << 24);
			}
			else if(a !== 0){
				a = Math.floor(a / 100 * 255);
				v = v + (a << 24);
			}
			return v;
		},
		/**
		 * 获得以'#'开头的Web格式颜色值；
		 * @return {String} 以'#'开头字符串的颜色值
		 */
		getWebValue : function(){
			var me = this,
				r = me.getRed(),
				g = me.getGreen(),
				b = me.getBlue(),
				rel = ['#'];
			rel.push(r.toString(16));
			rel.push(g.toString(16));
			rel.push(b.toString(16));
			return rel.join('');	
		},
		/**
		 * 获得'rgb(r,g,b)'格式的颜色值
		 */
		getRgbValue : function(){
			var me = this,
				r = me.getRed(),
				g = me.getGreen(),
				b = me.getBlue(),
				rel = ['rgb('];
			rel.push(r);
			rel.push(',');
			rel.push(g);
			rel.push(',');
			rel.push(b);
			rel.push(')');
			return rel.join('');	
		},
		/**
		 * 获得'rgba(r,g,b,a)'格式的颜色值
		 */
		getRgbaValue : function(){
			var me = this,
				r = me.getRed(),
				g = me.getGreen(),
				b = me.getBlue(),
				a = me.getAlpha(),
				rel = ['rgba('];
			rel.push(r);
			rel.push(',');
			rel.push(g);
			rel.push(',');
			rel.push(b);
			rel.push(',');
			rel.push(a / 100);
			rel.push(')');
			return rel.join('');	
		},
		/**
		 * 获得一个新的Color对象并使用新的透明度设定值;
		 * @param {Number} alpha 透明度设定值，取值范围0到100；其中0为完全透明，100为完全不透明。默认为100；
		 * @return {Color} 使用新透明度生成的Color对象实例。
		 */
		replaceAlpha : function(alpha){
			var me = this;
			return new PK.Color(me.getRed(), me.getGreen(), me.getBlue(), alpha);
		},
		/**
		 * 与另外一个颜色进行溶解计算并返回新的颜色值；
		 * @param {Color} color (必须)另外一个颜色的实例，如果不设定，则返回null；
		 * @param {Number} offset (可选)溶解计算时的偏移量；取值范围从0到100；默认值：50；
		 *		如果设定0，则完全取this对象的颜色值，如果设定100，则完全使用传入对象的颜色值。如果设定50则取两者的平均值。
		 * @return {Color} 新的颜色对象实例。
		 */
		mingle : function(color, offset){
			if(!color || isF(color.getRed)){
				return null;
			}
			offset = isN(offset) ? offset %101 : 50;
			var me = this;
			if(0 === offset){
				return new PK.Color(me.getRed(), me.getGreen(), me.getBlue(), me.getAlpha());
			}
			if(100 === offset){
				return new PK.Color(color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha());
			}
			var mc = (100 - offset) / 100,
				cc = offset / 100;
			
			var r = Math.round(me.getRed()*mc + color.getRed()*cc),
				g = Math.round(me.getGreen()*mc + color.getGreen()*cc),
				b = Math.round(me.getBlue()*mc + color.getBlue()*cc),
				a = me.getAlpha()*mc + color.getAlpha()*cc;
			
			return new Color(r,g,b,a);	
		},
		/**
		 * @overwrite
		 */
		toString : function(){
			var me = this,
				a = me.getAlpha();
			if(100 === a){
				return me.getWebValue();
			}
			else{
				return me.getRgbaValue();
			}	
		}
	};
	
	var PRO = Color.prototype;
	/**
	 * 获得以'#'开头的Web格式颜色值；
	 * @see #getWebValue
	 */
	PRO.web = PRO.getWebValue;
	/**
	 * 获得'rgb(r,g,b)'格式的颜色值
	 */
	PRO.rgb = PRO.getRgbValue;
	/**
	 * 获得'rgba(r,g,b,a)'格式的颜色值
	 */
	PRO.rgba = PRO.getRgbaValue;
	
	/**
	 * @public
	 * @static
	 * 解析一个字符串，当可以被解析时返回Color对象；否则返回undefined;
	 */
	Color.parse = function(s){
		var vs = parse(s);
		if(vs){
			return new PK.Color(vs[0],vs[1],vs[2],vs[3]);
		}
		return undefined;
	}
	Cmp.define('Cmp.util.Color',{
		factory : function(){
			return Color;
		}
	});
}());