var CompositeDisposable = require('atom').CompositeDisposable;
var vxService = require('./service');
var WebEditorView = require('./browser/web-editor-view');
var url = require('url');
var path = require('path');
function AtomVxController() {

	vxService.$initCache();

	this.modalPanel = null;
	this.subscriptions = null;
	this.browser = {};
	// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
	this.subscriptions = new CompositeDisposable();

	var self = this;
	var webappsRoot = path.join(vxService.packagePath, "atom-vx", "webapps");

	// Register command that toggles this view
	this.subscriptions.add(atom.commands.add('atom-workspace', {
		"vx:add-controller": function (event) {
			vxService.addController(self, event);
		},
		"vx:add-directive": function (event) {
			vxService.addDirective(self, event);
		},
		'vx:webview-home': function (event) {
			var href = "http://www.baidu.com";
			self.toggle(href, "Home", false);
		},
		'vx:webview-layout2': function (event) {
			var href = path.join(webappsRoot, "bootstrap2", "index.html");
			self.toggle("file://"+href, "bootstrap2 layout", true);
		},
		'vx:webview-layout3': function (event) {
			console.log(webappsRoot);
			var href = path.join(webappsRoot, "bootstrap3", "index.html");
			self.toggle("file://"+href, "bootstrap3 layout", true);
		},
		'vx:webview-vxdesign': function (event) {
			var href = "http://www.vxdesign.com";
			self.toggle(href, "vxdesign", false);
		},
		'vx:webview-reload': function (event) {
			self.reload(event);
		}
	}));

	//for browser
	this.browser.disposable = new CompositeDisposable();
	this.browser.pane = atom.workspace.getActivePane();
	this.browser.paneElement = atom.views.getView(this.browser.pane);
	this.browser.textEditor = atom.workspace.getActiveTextEditor();
	this.browser.textEditorElement = atom.views.getView(this.browser.textEditor);
	this.browser.editor = atom.workspace.buildTextEditor();
	//for browser
	this.browser.disposable.add(atom.workspace.addOpener(function (uri, options) {
		console.log(uri);
		if (uri === "view://web") {
			return new WebEditorView(options);
		}
	}));
	this.browser.disposable.add(atom.views.addViewProvider(WebEditorView, this.browser.paneElement));

	const editor = this.browser.editor;
	element = atom.views.getView(this.browser.editor);
	element.setAttribute('mini', '');
	var self = this;
	element.addEventListener('keydown', function (e) {
		if (e.keyCode === 13) {
			atom.commands.dispatch(editor, 'core:confirm');
			self.hide();
		}
		if (e.keyCode === 27) {
			atom.commands.dispatch(editor, 'core:cancel');
			return self.hide();
		}
	});
	this.browser.disposable.add(atom.commands.add(editor, {
		'core:confirm': this.confirm,
		'core:cancel': this.cancel
	}));
	this.browser.panel = atom.workspace.addModalPanel({
		item: editor,
		visible: false
	});
	this.browser.disposable.add(this.subscriptions);
}
AtomVxController.prototype = {
	constructor: AtomVxController,

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
		//this.browser.panel.show();
		//return atom.views.getView(this.browser.editor).focus();
	},
	hide: function () {
		return this.browser.panel.hide();
	},
	toggle: function (src, title, useToolBar) {
		if (this.browser.panel.isVisible()) {
			return this.hide();
		} else {
			return this.open(src, title, useToolBar);
		}
	},
	detach: function () {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.browser.disposable.dispose();
		this.browser.panel.destroy();
		this.browser.element.destroy();
	},
	destory: function () {
		console.log('destory...');
	}
};

module.exports = AtomVxController;