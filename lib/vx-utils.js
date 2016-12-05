module.exports = {
	init: function (atom) {
		var self = this;
		atom.commands.add('atom-text-editor', {
			'vx:addController': function (event) {
				self.addController(event);
			},
			'vx:addDirective': function (event) {
				self.addDirective(event)
			},
			'vx:browserVxdesign': function (event) {
				self.browserVxdesign(event);
			}
		});
	},
	addController: function (event) {
		console.log('addController');
		atom.workspace.addTopPanel();
	},
	addDirective: function (event) {
		console.log('addDirective');
		console.log(event);
	},
	browserVxdesign: function (event) {
		console.log('browserVxdesign');
		console.log(event);
	}
};
