/**
 * @class Lh.form.FileUpload
 * @extend Cmp.Widget
 * 文件上传空间实现；
 *
 * @cfg {String} name (可选)组件名
 * @cfg {String} label (可选)标签名
 * @cfg {String} valBoxWidth (可选)组件宽度
 * @cfg {String} uploadURL (必选)文件上传时的URL上传地址
 * @cfg {String} templateURL (可选)模板下载时的URL请求链接
 * @cfg {Array{Object}} 参数 [{key:'xx', value:'xxx'}]
 *
 * @version 1.0.0
 * @since 2016-12-22
 * @author Weihw
 */
(function() {
  function _unescapeHTML(str) {
    str = '' + str;
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }

  var HTML = [];
  HTML.push('<form class="cp-fileUpload-form" action="" target="" method="post" enctype="multipart/form-data">');
  HTML.push('<input type="file" name="file" class="cp-fileUpload-input"/>');
  HTML.push('</form>');
  HTML = HTML.join('');

  Cmp.define('Cp.form.FileUpload', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.Button',
      'Cmp.Dialogs'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        ButtonClazz = reqs[0],
        Dialogs = reqs[1];
      return Cmp.extend(ext, {
        /**
         * @private
         * @overwrite
         */
        initComponent: function() {
          var me = this,
            cls;
          cls = ['cp-fileUpload-box'];
          if (isS(me.cls)) {
            cls.push(me.cls);
          } else if (isA(me.cls)) {
            cls = cls.concat(me.cls);
          }
          me.cls = cls;
          superClazz.initComponent.call(me);

          me.addEvents(
            /**
             * @event
             * 当值发生改变时，分发此事件。
             * @param {Object} value 变化后的值
             */
            'changed',
            /**
             * 选择文件后触发
             * @param {Boolean} value 是否上传的文件合法
             */
            'hasFile'
          );
        },
        /**
         * @private
         * @overwrite
         */
        doRender: function() {
          var me = this,
            dom, el, lw;
          superClazz.doRender.call(me);
          me.el.update(HTML);
          me.params = !!me.params ? me.params : [];
          dom = me.el.dom;
          me.uploadForm = Cmp.get(dom.childNodes[0]);
          me.uploadInput = Cmp.get(dom.childNodes[0].firstChild);
          me.hideLabel = !!me.hideLabel;
          lw = '0rem';
          if (!me.hideLabel) {
            lw = me.labelWidth;
            if (!isS(lw)) {
              lw = '5rem';
            }
            el = me.el.createChild({
              cls: 'cp-fileUpload-label',
              style: {
                width: lw
              },
              html: '<strong>' + (me.label || '') + '</strong><i></i><b></b>'
            });
            me.labelBox = Cmp.get(el.dom.firstChild);
          }
          me.valBoxWidth = isS(me.valBoxWidth) ? me.valBoxWidth : '9rem';
          el = me.el.createChild({
            cls: 'cp-fileUpload-val',
            style: {
              left: lw,
              width: me.valBoxWidth
            }
          });
          me.valShowBox = el;
          me.labelWidth = lw;
          lw = parseInt(lw) + parseInt(me.valBoxWidth) + 1;
          lw = lw + 'rem';
          el = me.el.createChild({
            cls: 'cp-fileUpload-btnbar',
            style: {
              paddingLeft: lw
            }
          });
          me.btnBar = el;
          me.uploadBtn = new ButtonClazz({
            cls: 'cp-fileUpload-uploadbtn',
            text: '选择文件',
            handler: me.onUploadBtnClick,
            scope: me
          });
          me.uploadBtn.render(el.dom);
          if (!!me.templateURL) {
            me.downloadTemplateBtn = new ButtonClazz({
              cls: 'cp-fileUpload-downloadbtn',
              icon: ['fa', 'fa-download'],
              text: '下载模板',
              handler: me.onDownloadTemplateBtn,
              scope: me
            });
            me.downloadTemplateBtn.render(el.dom);
          }
          me.downloadFileBtn = new ButtonClazz({
            cls: 'cp-fileUpload-downloadbtn',
            icon: ['fa', 'fa-download'],
            text: '下载文件',
            handler: me.onDownloadFileBtn,
            scope: me
          });
          me.downloadFileBtn.render(el.dom);
          me.downloadFileBtn.hide();
          me.errorBox = el.createChild({
            cls: 'cp-fileUpload-error-msg'
          });

          me.uploadInput.on('change', me.onFileChange, me);
          // 上传文件后 回传的url
          me.uploadFileURL = '';
        },
        /**
         * 上传按钮点击处理事件
         * @author Weihw
         * @date   2016-12-22
         */
        onUploadBtnClick: function() {
          var me = this;
          me.uploadInput.dom.click();
        },
        /**
         * 下载模板按钮点击处理事件
         * @author Weihw
         * @date   2016-12-22
         */
        onDownloadTemplateBtn: function() {
          var me = this;
          if (typeof me.templateURL !== 'undefined') {
            me.download(me.templateURL);
          }
        },
        /**
         * 下载文件按钮点击处理事件
         * @author Weihw
         * @date   2017-01-03
         */
        onDownloadFileBtn: function() {
          var me = this;
          if (typeof me.fileURL !== 'undefined') {
            window.open(me.fileURL);
          }
        },
        /**
         * 下载方法
         * @author Weihw
         * @date   2017-01-17
         * @param  {[type]}   url [description]
         * @return {[type]}       [description]
         */
        download: function(url) {
          var me = this,
            len, i = 0,
            temp, input, form;
          form = document.createElement('form');
          for (len = me.params.length; i < len; i++) {
            temp = me.params[i];
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = temp.key;
            input.value = temp.value;
            form.appendChild(input);
          }
          Cmp.getBody().dom.appendChild(form);
          form.action = url;
          form.method = 'post';
          form.submit();
          Cmp.getBody().dom.removeChild(form);
          form = null;
          input = null;
        },
        /**
         * 文件改变时触发事件
         * @author Weihw
         * @date   2016-12-22
         * @param  {Event}   ev [description]
         */
        onFileChange: function(event) {
          var me = this,
            name;
          name = me.uploadInput.dom.value;
          me.valShowBox.update();
          name = me.checkFilename(name);
          if (isS(name)) {
            me.valShowBox.update(name);
            me.fileName = name;
            me.fireEvent('hasFile', true);
          } else {
            me.valShowBox.update('');
            me.fireEvent('hasFile', false);
          }
        },
        /**
         * 检查文件内容
         * @author Weihw
         * @date   2016-12-22
         * @param  {String}   value 文件路径名
         * @return {boolean/String}  result false:验证失败, String:验证成功并返回文件名
         */
        checkFilename: function(value) {
          var me = this,
            strTemp = value.split("."),
            strCheck = strTemp[strTemp.length - 1].toLowerCase(),
            i = 0,
            len = me.limitPostfix.length,
            flag = false;
          for (; i < len; i++) {
            if (strCheck == me.limitPostfix[i]) {
              flag = true;
              break;
            }
          }
          if (flag) {
            strTemp = value.split("\\");
            me.hideError();
            return strTemp[strTemp.length - 1];
          } else {
            me.showError('上传文件类型不对！');
            return false;
          }
        },
        /**
         * 获取值
         * @returns {{name: *, uploadFileURL: (*|string|String)}}
         */
        getValue: function() {
          var me = this;
          return {
            name: me.fileName,
            uploadFileURL: me.uploadFileURL
          }
        },
        /**
         * 设置到错误状态，并显示指定的错误信息
         */
        showError: function(msg) {
          var me = this;
          if (!me._hasError) {
            me._hasError = true;
            me.el.addClass('cp-fileUpload-error');
          }
          me.updateErrorMsg(msg);
        },
        /**
         * 退出错误状态，并隐藏指定的错误信息。
         */
        hideError: function() {
          var me = this;
          if (me._hasError) {
            me._hasError = false;
            me.el.removeClass('cp-fileUpload-error');
          }
          me.updateErrorMsg();
        },
        /**
         * @private
         * 更新错误信息。
         */
        updateErrorMsg: function(msg) {
          var me = this;
          if (me.errorBox) {
            me.errorBox.update(msg || '');
          }
        },
        /**
         * 文件上传
         * @author Weihw
         * @date   2017-01-11
         * @return {[type]}   [description]
         */
        fileUploadToServer: function(data) {
          var me = this,
            form, i, len, temp, params, tempIframe,
            input;
          tempIframe = Cmp.getBody().createChild({
            tag: 'iframe',
            id: 'uploadIframe',
            cls: 'cp-fileUpload-hideIframe',
            atts: {
              name: 'uploadIframe'
            }
          });
          /**
           * 上传文件回调处理
           * @author Weihw
           * @date   2017-01-11
           */
          tempIframe.dom.onload = function() {
            var iframeDom = tempIframe.dom,
              data,
              msg = '',
              i, reg, result, stri1;
            try {
              if (iframeDom.contentWindow) {
                data = iframeDom.contentWindow.document.body ? iframeDom.contentWindow.document.body.innerHTML : null;
              } else if (iframeDom.contentDocument) {
                data = iframeDom.contentDocument.document.body ? iframeDom.contentDocument.document.body.innerHTML : null;
              }
            } catch (e) {
              data = '';
            }
            reg = '';
            if (data.indexOf('<pre>') > -1) {
              reg = /<pre>(.+)<\/pre>/g;
            } else {
              reg = /<pre.+?>(.+)<\/pre>/g;
            }
            result = data.match(reg);
            stri1 = RegExp.$1;
            if (stri1 != null && stri1 !== '' && stri1.trim().length > 0) {
              data = stri1;
            }
            eval('data =' + data);
            Dialogs.hide();
            me.uploadFileURL = isS(data.result) ? data.result : '';
            me.uploadFileURL = _unescapeHTML(me.uploadFileURL);
            if (isN(data.result) && data.result === 1) {
              Dialogs.showSuccess('文件上传成功。');
              me.doChanged(true);
            } else {
              if (typeof data.result !== 'undefined' && isA(data.result)) {
                for (i = 0; i < data.result.length; i++) {
                  msg += data.result[i] + '<br/>';
                }
              } else if (typeof data.msg !== 'undefined' && isS(data.msg)) {
                msg = data.msg;
              } else {
                msg = '文件上传失败。';
              }
              Dialogs.showWarn('文件上传失败，详情见页面错误信息。');
              me.doChanged(false, msg);
            }

            for (i = form.childNodes.length - 1; i > 0; i--) {
              form.removeChild(form.childNodes[i]);
            }
            tempIframe.remove();
          };

          form = me.uploadForm.dom;
          form.action = me.uploadURL;
          form.target = 'uploadIframe';
          // 添加参数
          params = isA(me.params) ? me.params : [];
          if (isA(data)) {
            params = params.concat(data);
          }
          for (i = 0, len = params.length; i < len; i++) {
            temp = params[i];
            input = document.createElement('input');
            input.type = 'text';
            input.name = temp.key;
            input.value = temp.value;
            form.appendChild(input);
          }
          try {
            form.submit();
          } catch (e) {
            console.log(e);
          }
        },
        /**
         * 值改变时触发该事件。
         * @author Weihw
         * @date   2017-01-03
         * @return {[type]}   [description]
         */
        doChanged: function(flag, msg) {
          var me = this,
            data = {
              flag: flag
            };
          if (typeof msg !== 'undefined') {
            data.msg = msg;
          }
          me.fireEvent('changed', data, me);
        },
        /**
         * 改变显示状态，变为下载之前的文件
         * @author Weihw
         * @date   2017-01-03
         */
        changeDisplayToStatic: function() {
          var me = this;
          me.uploadBtn.hide();
          me.uploadForm.setHideModal('display');
          me.uploadForm.hide();
          if (isS(me.templateURL)) {
            me.downloadTemplateBtn.hide();
          }
          me.downloadFileBtn.show();
        },
        /**
         * 改变显示状态，修改文件
         * @author Weihw
         * @date   2017-01-03
         */
        changeDisplayToDynamic: function() {
          var me = this;
          me.uploadBtn.hide();
          if (isS(me.templateURL)) {
            me.downloadTemplateBtn.hide();
          }
          if (isS(me.fileURL)) {
            me.downloadFileBtn.show();
          }
          me.uploadBtn.show();
        },
        /**
         * 设置input框显示的值
         * @author Weihw
         * @date   2017-01-03
         * @param {String} fileURL 文件下载的路径
         * @param {String} name    (可选)文件名
         */
        setValue: function(fileURL, name) {
          var me = this,
            lw;
          if (isS(fileURL)) {
            me.fileURL = fileURL;
            me.uploadFileURL = fileURL;
          }
          if (!!name && isS(name)) {
            lw = parseInt(me.valBoxWidth) + parseInt(me.labelWidth) + 1;
            me.btnBar.setStyle('padding-left', lw + 'rem');
            me.valShowBox.update(name);
          } else {
            me.btnBar.setStyle('padding-left', '5rem');
            me.valShowBox.hide();
          }
        },
        clear: function() {
          var me = this,
            temp, childNodes, i, uploadFormDom;
          me.fileURL = null;
          me.fileName = null;
          me.uploadFileURL = null;
          me.valShowBox.update('');
          me.uploadForm.dom.removeChild(me.uploadInput.dom);
          uploadFormDom = me.uploadForm.dom;
          childNodes = uploadFormDom.childNodes;
          for (i = childNodes.length - 1; i >= 0; i--) {
            uploadFormDom.removeChild(childNodes[i]);
          }
          temp = document.createElement('input');
          temp.type = 'file';
          temp.name = 'file';
          temp.className = 'cp-fileUpload-input';
          me.uploadForm.dom.appendChild(temp);
          me.uploadInput = Cmp.get(temp);
          me.uploadInput.on('change', me.onFileChange, me);
          uploadFormDom = null;
          childNodes = null;
        }
      })
    }
  });
}());
