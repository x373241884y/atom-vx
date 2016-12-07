var AtomVxController = require('./controller');
module.exports = {
	activate(state) {
		this.controller = new AtomVxController();
	},
	deactivate() {
		this.controller.detach();
		this.controller.destroy();
		this.controller = null;
	}
};
