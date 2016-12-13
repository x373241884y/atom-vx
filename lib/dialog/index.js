var vxService = require('../service');
module.exports = DialogPlugin = {
	activate: function (ctrl) {
		this.subscriptions = ctrl.subscriptions;
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			"vx:open-terminal": function (event) {
				vxService.openTerminal(event);
			},
			"vx:add-html5": function (event) {
				vxService.addHtml5(event);
			},
			"vx:add-controller": function (event) {
				vxService.addController(event);
			},
			"vx:add-directive": function (event) {
				vxService.addDirective(event);
			}
		}));
		ctrl.log("activate dialog....");
	},
	deactivate: function (ctrl) {
		this.subscriptions = null;
		ctrl.log("deactivate dialog....");
	}
};