var CompositeDisposable = require('event-kit').CompositeDisposable;
var vxUtils = require('./vx-utils');
module.exports = {
	active: false,
	isActive: function () {
		return this.active;
	},
	activate: function (state) {
		this.subscriptions = new CompositeDisposable;
	},
	consumeMinimapServiceV1: function (minimap1) {
		this.minimap = minimap1;
		this.minimap.registerPlugin('atom-vx', this);
	},
	deactivate: function () {
		this.minimap.unregisterPlugin('atom-vx');
		this.minimap = null;
	},
	activatePlugin: function () {
		if (this.active) return;
		vxUtils.init(atom);

		this.active = true;
		this.minimapsSubscription = this.minimap.observeMinimaps(function (minimap) {
			var minimapElement = atom.views.getView(minimap);
		});
	},
	deactivatePlugin: function () {
		if (!this.active) return;
		this.active = false;
		this.minimapsSubscription.dispose();
		this.subscriptions.dispose();
	}
};
