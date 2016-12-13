var controller = require('./controller');
module.exports = {
	activate(state) {
		controller.log('enable plugins starting>>>>>>>');
		controller.enable(state);
	},
	deactivate(state) {
		controller.log('disable plugins starting<<<<<<<');
		controller.disable(state);
	}
};
