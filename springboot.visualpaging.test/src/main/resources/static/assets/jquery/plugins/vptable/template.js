/**
 * 自定义插件的模板代码
 * @param $
 * @returns
 */
(function ($) {
	"use strict";
	
	var isIEBrowser = function () {
        return !!(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
    };
	
	var VisualPagingTable = function(el, options) {
		this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();

        this.init();
	};
	
	VisualPagingTable.DEFAULTS = {
		classes: 'table table-hover'
	}
	
	VisualPagingTable.prototype.init = function () {
		//各种方法
	};
	
    // BOOTSTRAP TABLE PLUGIN DEFINITION
    var allowedMethods = [
    ];
    
    $.fn.visualPagingTable = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, VisualPagingTable.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new VisualPagingTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };
    
    
    $.fn.visualPagingTable.Constructor = VisualPagingTable;
    $.fn.visualPagingTable.defaults = VisualPagingTable.DEFAULTS;
    $.fn.visualPagingTable.methods = allowedMethods;
    $.fn.visualPagingTable.utils = {
        isIEBrowser: isIEBrowser
    };
})(jQuery);
