'use babel';

import AtomVxView from './atom-vx-view';
import { CompositeDisposable } from 'atom';
import vxUtils from './vx-utils.js';
export default {
	tooltipdiv: null,
	atomVxView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {

		this.atomVxView = new AtomVxView(state.atomVxViewState);
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.atomVxView.getElement(),
			visible: false
		});
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
		this.subscriptions.add(atom.tooltips.add(this.tooltipdiv, {title: 'This is a tooltip'}))
	},

	deactivate() {
		this.tooltipdiv.dispose();
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.atomVxView.destroy();
	},

	serialize() {
		return {
			atomVxViewState: this.atomVxView.serialize()
		};
	},

	toggle() {
		atom.tooltips.add(this.tooltipdiv, {title: 'atom vx is actived!'});
		console.log('toggle atom vx!');
		return this;
	}

};
