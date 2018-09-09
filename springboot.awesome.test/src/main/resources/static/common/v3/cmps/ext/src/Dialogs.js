/**
 * 显示模态对话框工具；
 * 
 * @static Cmp.Dialogs
 * @version 2.3.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	var bodyMask,dlg
	
	/**
	 * 构建等待框的内部HTML
	 */
	var biuldWaitHtml = function(msg){
		var html = [];
		html.push('<div class="c-dlgs-icon"></div>');
		html.push('<div class="c-dlgs-msgbox"><div class="c-dlgs-msgbox-inner">');
		html.push(msg);
		html.push('</div></div>');
		return html.join('');
	}

	var Rel = {
		/**
		 * 隐藏所打开的对话框；
		 */
		hide : function(){
			if(dlg){
				dlg.hide();
			}
		},
		/**
		 * 显示等待框
		 * @param {String} msg 显示的信息;
		 */
		showWait : function(msg){
			if(dlg){
				dlg.hideBoth();
				dlg.updateBody(biuldWaitHtml(msg), 'c-dlgs-wait');
				dlg.show();
			}
		},
		/**
		 * 显示警告框，并显示'关闭'按钮；
		 * @param {String} msg 显示的信息;
		 * @param {String} title 警告框的标题文字
		 */
		showWarn : function(msg, title){
			if(dlg){
				dlg.showBoth(title || '', [{id : 'ok', text :'关闭',handler : function(){
					dlg.hide();
				}}]);
				dlg.updateBody(biuldWaitHtml(msg), 'c-dlgs-warn');
				dlg.show();
			}
		},
		/**
		 * 显示执行成功样式的窗口，并显示'确认'按钮；
		 *
		 * @param {String} msg 显示的信息;
		 * @param {String} title 成功框的标题文字
		 * @param {Function} callback 点击成功框上'确认’按钮之后的回调方法；
		 * @paarm {Object} scope 调用回调方法时的this对象设定；
		 */
		showSuccess : function(msg, title, callback, scope){
			if(dlg){
				dlg.showBoth(title || '', [{id : 'ok', text :'确认',handler : function(){
					dlg.hide();
					Cmp.invoke(callback, scope);
				}}]);
				dlg.updateBody(biuldWaitHtml(msg), 'c-dlgs-success');
				dlg.show();
			}
		},
		/**
		 * 显示执行成功样式的窗口，并显示'确定'和'取消'这两个按钮
		 *
		 * @param {String} msg 显示的信息;
		 * @param {String} title 成功框的标题文字
		 * @param {Function} callback 点击成功框上按钮之后的回调方法；
		 *		如果点击的时'确定'则传入true；如果点击的是'取消'则传入false；
		 * @paarm {Object} scope 调用回调方法时的this对象设定；
		 */
		showSuccessForOkcanel : function(msg, title, callback, scope){
			if(dlg){
				dlg.showBoth(title || '', [
					{id : 'ok', text :'确定',
						handler : function(){
							dlg.hide();
							Cmp.invoke(callback, scope,[true]);
						}
					},{
						id : 'cancel', text :'取消',
						handler : function(btn){
							dlg.hide();
							Cmp.invoke(callback, scope,[false]);
						}
					}
				]);
				dlg.updateBody(biuldWaitHtml(msg), 'c-dlgs-success');
				dlg.show();
			}
		},
		/**
		 * 显示执行成功样式的窗口，并显示'是'和'否'这两个按钮
		 *
		 * @param {String} msg 显示的信息;
		 * @param {String} title 成功框的标题文字
		 * @param {Function} callback 点击成功框上按钮之后的回调方法；
		 *		如果点击的时'是'则传入true；如果点击的是'否'则传入false；
		 * @paarm {Object} scope 调用回调方法时的this对象设定；
		 * @param {Object} btns 按钮文字配之；属性'ok'的值是为'OK'按钮定义的显示文字,默认为'是'；属性'cancel'的值是为'Cancel'按钮定义的显示文字,默认为'否'；
		 */
		showSuccessForYesNo : function(msg, title, callback, scope, btns){
			if(dlg){
				dlg.showBoth(title || '', [
					{id : 'ok', text : (btns ? (btns['ok']||'是') : '是'),
						handler : function(){
							dlg.hide();
							Cmp.invoke(callback, scope,[true]);
						}
					},{
						id : 'cancel', text : (btns ? (btns['cancel']||'否') : '否'),
						handler : function(btn){
							dlg.hide();
							Cmp.invoke(callback, scope,[false]);
						}
					}
				]);
				dlg.updateBody(biuldWaitHtml(msg), 'c-dlgs-success');
				dlg.show();
			}
		},
		/**
		 * 显示一个带有疑问性质的确认框，并显示'确定'和'取消'这两个按钮；
		 * 
		 * @param {String} msg 显示的信息;
		 * @param {String} title 警告框的标题文字
		 * @param {Function} callback 点击确认框上按钮之后的回调方法；
		 *		如果点击的时'确定'则传入true；如果点击的是'取消'则传入false；
		 * @paarm {Object} scope 调用回调方法时的this对象设定；
		 */
		showConfirm : function(msg, title, callback, scope){
			if(dlg){
				dlg.updateBody(biuldWaitHtml(msg), 'c-dlgs-confirm');
				dlg.showBoth(
					title || '', 
					[{
						id : 'ok', text :'确定',
						handler : function(btn){
							dlg.hide();
							Cmp.invoke(callback, scope,[true]);
						}
					},{
						id : 'cancel', text :'取消',
						handler : function(btn){
							dlg.hide();
							Cmp.invoke(callback, scope,[false]);
						}
					}]
				);
				dlg.show();
			}
		}
	};
	
	Cmp.define('Cmp.Dialogs',{
		requires : [
			'Cmp.Dialog'
		],
		cls : true,
		factory : function(ext, reqs){
			dlg = new reqs[0]();
			dlg.render(Cmp.getBody());
			dlg.hide();
			return Rel;
		}
	});
}());