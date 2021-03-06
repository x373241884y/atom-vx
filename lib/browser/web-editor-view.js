// Generated by CoffeeScript 1.12.0
(function () {
	var vxService = require('../service');
	var defaults = {
		src: "http://www.baidu.com",
		showToolBar: false,
		title: "Web View"
	};
	module.exports = (function () {
		function WebEditorView(options) {
			var self, wraper, body, tool_bar, iframe, tool_item1, tool_item2, tool_item3;
			//创建元素
			wraper = document.createElement("div");
			body = document.createElement("div");
			iframe = document.createElement('iframe');
			tool_bar = document.createElement("div");
			tool_item1 = document.createElement('span');
			tool_item1.className = "tool-items icon icon-move-down";
			tool_item1.textContent = "生成交易页";
			tool_item2 = document.createElement('span');
			tool_item2.className = "tool-items icon icon-file-directory";
			tool_item2.textContent = "生成纯页面";
			tool_item3 = document.createElement('span');
			tool_item3.className = "tool-items icon  icon-clippy";
			tool_item3.textContent = "复制";

			wraper.classList.add("web-view");
			wraper.classList.add("pane-item");
			body.classList.add("web-view-body");
			tool_bar.classList.add("web-view-toolbar");

			tool_bar.appendChild(tool_item1);
			tool_bar.appendChild(tool_item2);
			tool_bar.appendChild(tool_item3);

			body.appendChild(iframe);
			wraper.appendChild(body);
			wraper.appendChild(tool_bar);

			self = this;
			this.element = wraper;
			this.iframe = iframe;
			this.toolbar = tool_bar;
			if (options) {
				this.options = {
					src: options.src || defaults.src,
					showToolBar: options.showToolBar || defaults.showToolBar,
					title: options.title || defaults.src
				};
			} else {
				this.options = Object.create(defaults);
			}

			this.relocate(this.options.src);

			this.iframe.setAttribute('name', 'disable-x-frame-options');
			this.iframe.addEventListener('load', function (event) {
				self.title = this.contentDocument.title;
				//return atom.notifications.addSuccess(self.options.title + " has loaded.");
			});
			if (this.options.showToolBar) { //显示工具栏
				this.toolbar.addEventListener('click', function (event) { //工具栏事件
					var target = event.target, index, $;
					$ = require('atom-space-pen-views').jQuery;
					index = $(target).index();
					if (index == 0) { //第一个按钮
						var window = self.iframe.contentWindow;
						window.downloadLayoutSrc();
						vxService.addLayoutFile1(null, window.formatSrc);
					} else if (index == 1) { //第二个按钮
						var window = self.iframe.contentWindow;
						window.downloadLayoutSrc();
						vxService.addLayoutFile2(null, window.formatSrc);
					} else if (index == 2) { ////第三个按钮
						var window = self.iframe.contentWindow;
						window.downloadLayoutSrc();
						atom.clipboard.write(window.formatSrc);
					}

				});
				tool_bar.classList.add("active");
			}

		}

		WebEditorView.prototype.relocate = function (source) {
			if (this.iframe.contentWindow) {
				return this.iframe.contentWindow.location.href = source;
			} else {
				return this.iframe.setAttribute('src', source);
			}
		};

		WebEditorView.prototype.getTitle = function () {
			return this.options.title;
		};

		WebEditorView.prototype.serialize = function () {
			if (this.iframe.contentWindow) {
				return this.iframe.contentWindow.location.href;
			} else {
				return this.iframe.getAttribute('src');
			}
		};

		WebEditorView.prototype.destroy = function () {
			var $ = require('atom-space-pen-views').jQuery;
			$(this.toolbar).unbind("click");
			$(this.iframe).unbind("load");
			this.toolbar.remove();
			this.iframe.remove();
			this.options = null;
			return this.element.remove();
		};

		return WebEditorView;

	})();

}).call(this);
