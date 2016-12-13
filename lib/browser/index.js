var path = require('path');
var fs = require('fs');
var utils = require('../utils');
var WebEditorView = require('./web-editor-view');
module.exports = BrowserPlugin = {
	subscriptions: null,
	controller: null,
	pane: null,
	paneElement: null,
	textEditor: null,
	editor: null,
	panel: null,
	element: null,
	activate: function (ctrl) {
		this.subscriptions = ctrl.subscriptions;
		this.controller = ctrl;
		//for browser
		this.pane = atom.workspace.getActivePane();
		this.paneElement = atom.views.getView(this.pane);
		this.textEditor = atom.workspace.getActiveTextEditor();
		this.editor = atom.workspace.buildTextEditor();
		this.panel = atom.workspace.addModalPanel({
			item: this.editor,
			visible: false
		});
		this.element = atom.views.getView(this.editor);

		var self = this,
			webappsRoot = ctrl.packageAppsPath;
		this.element.setAttribute('mini', '');
		this.element.addEventListener('keydown', function (e) {
			if (e.keyCode === 13) {
				atom.commands.dispatch(this.editor, 'core:confirm');
				self.hide();
			}
			if (e.keyCode === 27) {
				atom.commands.dispatch(this.editor, 'core:cancel');
				return self.hide();
			}
		});

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'vx:webview-layout2': function (event) {
				var href = path.join(webappsRoot, "bootstrap2", "index.html");
				self.toggle("file://" + href, "bootstrap2 layout", true);
			},
			'vx:webview-layout3': function (event) {
				var href = path.join(webappsRoot, "bootstrap3", "index.html");
				self.toggle("file://" + href, "bootstrap3 layout", true);
			},
			'vx:webview-reload': function (event) {
				self.reload(event);
			}
		}));
		this.subscriptions.add(atom.workspace.addOpener(function (uri, options) {
			if (uri === "view://web") {
				return new WebEditorView(options);
			}
		}));
		this.subscriptions.add(atom.views.addViewProvider(WebEditorView, this.paneElement));
		this.subscriptions.add(atom.commands.add(this.editor, {
			'core:confirm': this.confirm,
			'core:cancel': this.cancel
		}));
		ctrl.log("activate browser....");
	},
	deactivate: function (ctrl) {
		this.subscriptions = null;
		this.controller = null;
		this.panel.destroy();
		this.element = null;
		this.paneElement = null;
		this.textEditor = null;
		this.editor = null;
		ctrl.log("deactivate browser....");
	},
	confirm: function (event) {
		var pane, text;
		pane = atom.workspace.getActivePane();
		text = this.getText();
		if (pane.activeItem instanceof WebEditorView) {
			return pane.activeItem.relocate(text);
		} else {
			return atom.notifications.addError("Web View must be the active item.");
		}
	},
	reload: function (event) {
		var pane;
		pane = atom.workspace.getActivePane();
		if (pane.activeItem instanceof WebEditorView) {
			return pane.activeItem.iframe.contentWindow.location.reload();
		}
	},
	cancel: function (event) {
		return atom.workspace.panelForItem(this).hide();
	},
	open: function (src, title, useToolBar) {
		atom.workspace.open("view://web", {
			src: src,
			title: title,
			showToolBar: useToolBar
		});
		//this.panel.show();
		//return atom.views.getView(this.editor).focus();
	},
	hide: function () {
		return this.panel.hide();
	},
	toggle: function (src, title, useToolBar) {
		if (this.panel.isVisible()) {
			return this.hide();
		} else {
			return this.open(src, title, useToolBar);
		}
	}

};