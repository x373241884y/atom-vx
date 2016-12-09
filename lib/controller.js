var CompositeDisposable = require('atom').CompositeDisposable;
var vxService = require('./service');
var WebEditorView = require('./browser/web-editor-view');
var url = require('url');
var path = require('path');
function AtomVxController() {

	this.debug = true;
	vxService.$initService(this);

	this.subscriptions = new CompositeDisposable();
	//for browser
	this.browser = {};
	this.browser.pane = atom.workspace.getActivePane();
	this.browser.paneElement = atom.views.getView(this.browser.pane);
	this.browser.textEditor = atom.workspace.getActiveTextEditor();
	this.browser.textEditorElement = atom.views.getView(this.browser.textEditor);
	this.browser.editor = atom.workspace.buildTextEditor();
	this.browser.panel = atom.workspace.addModalPanel({
		item: this.browser.editor,
		visible: false
	});
	this.browser.element = atom.views.getView(this.browser.editor);

	var self = this,
		editor = this.browser.editor,
		webappsRoot = path.join(vxService.packagePath, "atom-vx", "webapps"),
		element = this.browser.element;
	element.setAttribute('mini', '');
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

	// Register command that toggles this view
	this.subscriptions.add(atom.commands.add('atom-workspace', {
		"vx:open-terminal": function (event) {
			vxService.openTerminal(event);
		},
		"vx:add-controller": function (event) {
			vxService.addController(event);
		},
		"vx:add-directive": function (event) {
			vxService.addDirective(event);
		},
		'vx:webview-home': function (event) {
			var href = "http://www.baidu.com";
			self.toggle(href, "Home", false);
		},
		'vx:webview-layout2': function (event) {
			var href = path.join(webappsRoot, "bootstrap2", "index.html");
			self.toggle("file://" + href, "bootstrap2 layout", true);
		},
		'vx:webview-layout3': function (event) {
			console.log(webappsRoot);
			var href = path.join(webappsRoot, "bootstrap3", "index.html");
			self.toggle("file://" + href, "bootstrap3 layout", true);
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
	this.subscriptions.add(atom.workspace.addOpener(function (uri, options) {
		if (uri === "view://web") {
			return new WebEditorView(options);
		}
	}));
	this.subscriptions.add(atom.views.addViewProvider(WebEditorView, this.browser.paneElement));
	this.subscriptions.add(atom.commands.add(editor, {
		'core:confirm': this.confirm,
		'core:cancel': this.cancel
	}));
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
		this.subscriptions.dispose();
		this.browser.panel.destroy();
		this.browser.element = null;
	},
	destory: function () {
		vxService.$destoryService(this);
	},
	log: function (msg) {
		if (this.debug) {
			console.log.apply(this, arguments);
		}
	}
};

module.exports = AtomVxController;