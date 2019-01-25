(function ($) {
	"use strict";
	
	var isIEBrowser = function () {
        return !!(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
    };
    
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };
    
    var setFieldIndex = function (columns) {
        var i, j, k,
            totalCol = 0,
            flag = [];

        for (i = 0; i < columns[0].length; i++) {
            totalCol += columns[0][i].colspan || 1;
        }

        for (i = 0; i < columns.length; i++) {
            flag[i] = [];
            for (j = 0; j < totalCol; j++) {
                flag[i][j] = false;
            }
        }

        for (i = 0; i < columns.length; i++) {
            for (j = 0; j < columns[i].length; j++) {
                var r = columns[i][j],
                    rowspan = r.rowspan || 1,
                    colspan = r.colspan || 1,
                    index = $.inArray(false, flag[i]);

                if (colspan === 1) {
                    r.fieldIndex = index;
                    // when field is undefined, use index instead
                    if (typeof r.field === 'undefined') {
                        r.field = index;
                    }
                }

                for (k = 0; k < rowspan; k++) {
                    flag[i + k][index] = true;
                }
                for (k = 0; k < colspan; k++) {
                    flag[i][index + k] = true;
                }
            }
        }
    };
    
	var VisualPagingTable = function(el, options) {
		this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
	};
	
	VisualPagingTable.DEFAULTS = {
		classes: 'table table-hover',
		columns: [],
        data: [],
	}
	
	VisualPagingTable.prototype.init = function () {
		this.initContainer();
		this.initTable();
		this.initHeader();
		this.initBody();
	};
	
	VisualPagingTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="vptable">',
            '<div class="fixed-table-toolbar"></div>',
            '<div class="fixed-table-container">',
            '<div class="fixed-table-header"><table><thead><tr></tr></thead></table></div>',
            '<div class="fixed-table-body">',
            '<div class="fixed-table-loading">',
//            this.options.formatLoadingMessage(),
            '</div>',
            '</div>',
            '<div class="fixed-table-footer"><table><tr></tr></table></div>',
            '</div>',
            '<div class="fixed-table-pagination"></div>',
            '</div>'
        ].join(''));

        this.$container.insertAfter(this.$el);
        this.$tableContainer = this.$container.find('.fixed-table-container');
        this.$tableHeader = this.$container.find('.fixed-table-header');
        this.$tableBody = this.$container.find('.fixed-table-body');
        this.$tableLoading = this.$container.find('.fixed-table-loading');
        this.$tableFooter = this.$container.find('.fixed-table-footer');
        this.$pagination = this.$container.find('.fixed-table-pagination');

        this.$tableBody.append(this.$el);
        this.$container.after('<div class="clearfix"></div>');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
            this.$el.addClass('table-striped');
        }
        if ($.inArray('table-no-bordered', this.options.classes.split(' ')) !== -1) {
            this.$tableContainer.addClass('table-no-bordered');
        }
        
    };
    
    VisualPagingTable.prototype.initTable = function() {
    	Array.prototype.push.apply(this.options.columns, VisualPagingTable.DEFAULTS.columns);
    };
    
    VisualPagingTable.prototype.initHeader = function() {
    	var that = this, html = [];

    	this.$headerTr = this.$tableHeader.find('tr');
    	
    	$.each(this.options.columns, function (i, column) {
    		html.push('<th>');
    		
    		if(column.checkbox) {
    			
    		} else if(column.field) {
    			html.push(column.title || '');
    		} else if(column.title) {
    			html.push(column.title || '');
    		}
    		html.push('</th>');
    	});
    	
    	this.$headerTr.append(html.join(''));
    };
    
    VisualPagingTable.prototype.initRender = function(type, render, index, value) {
    	if('checkbox' === type) {
    		
    	} else {
    		if(typeof render === 'Function') {
    			render(value, index);
    		}
    	}
    };
    
    VisualPagingTable.prototype.initData = function() {
    	
    };
    
    VisualPagingTable.prototype.initBody = function() {
    	var trFragments = $(document.createDocumentFragment());
    	
    };
    
    VisualPagingTable.prototype.loadData = function(data) {
    	this.options.data = data || this.options.data;
    	
    	this.initData();
    	this.initBody();
    };
    
    VisualPagingTable.prototype.ajax = function(url, params, type) {
    	var that = this;
    	
    	if(type === 'get') {
    		$.ajax({
    			type: "GET",
    			url: url,
    			data: params || {},
    			dataType: 'json',
    			success: function(data) {
    				that.loadData(data);
    			}, 
    			error: function(XMLHttpRequest, textStatus, errorThrown){
    				window.console || window.console.log(errorThrown);
    			}
    		});
    	}
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
