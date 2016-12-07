'use babel';

import { CompositeDisposable } from 'atom';
import vxUtils from './vx-utils.js';
import WebEditorView from './browser/web-editor-view';
var url = require('url');
export default {
	tooltipdiv: null,
	modalPanel: null,
	subscriptions: null,
	browser: {},
	activate(state) {

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();
		var self = this;
		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'vx:toggle': function (event) {
				self.toggle();
			},
			"vx:add-controller": function (event) {
				vxUtils.addController(self, event);
			},
			"vx:add-directive": function (event) {
				vxUtils.addDirective(self, event);
			},
			"vx:browser-vxdesign": function (event) {
				vxUtils.browserVxdesign(self, event);
			}
		}));
		this.tooltipdiv = document.createElement('div');
		this.subscriptions.add(atom.tooltips.add(this.tooltipdiv, {title: 'This is a tooltip'}));

		//init browser
		this.initBrowser(state);
	},
	initBrowser: function (state) {
		//for browser
		this.browser.disposable = new CompositeDisposable();
		this.browser.pane = atom.workspace.getActivePane();
		this.browser.paneElement = atom.views.getView(this.browser.pane);
		this.browser.textEditor = atom.workspace.getActiveTextEditor();
		this.browser.textEditorElement = atom.views.getView(this.browser.textEditor);

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'vx:web-view-toggle': (function (_this) {
				return function () {
					return _this.togglevx();
				};
			})(this),
			'vx:web-view-reload': (function (_this) {
				return function () {
					return _this.reload();
				};
			})(this)
		}));

		this.browser.disposable.add(atom.workspace.addOpener(function (uri) {
			console.log(uri);
			if (uri === "view://web") {
				return new WebEditorView();
			}
		}));
		this.browser.disposable.add(atom.views.addViewProvider(WebEditorView, this.browser.paneElement));

		this.browser.editor = atom.workspace.buildTextEditor();
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
	},
	deactivate() {
		this.tooltipdiv.dispose();
		this.modalPanel.destroy();
		this.subscriptions.dispose();

		this.browser.disposable.dispose();
		this.browser.panel.destroy();
		this.browser.element.destroy();
	},

	serialize() {
		return {};
	},

	toggle() {
		atom.tooltips.add(this.tooltipdiv, {title: 'atom vx is actived!'});
		console.log('toggle atom vx!');
		return this;
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
	show: function () {
		atom.workspace.open("view://web");
		//this.browser.panel.show();
		//return atom.views.getView(this.browser.editor).focus();
	},
	hide: function () {
		return this.browser.panel.hide();
	},
	togglevx: function () {
		if (this.browser.panel.isVisible()) {
			return this.hide();
		} else {
			return this.show();
		}
	}

};
