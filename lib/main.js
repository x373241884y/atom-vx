var AtomVxController = require('./controller');
module.exports = {
	ctrl: null,
	activate(state) {
		this.ctrl = new AtomVxController();
		this.ctrl.log('create controller>>>>>>>');
	},
	deactivate() {
		this.ctrl.log('destory controller<<<<<<<');
		this.ctrl.detach();
		this.ctrl.destory();
		this.ctrl = null;
	}
};
