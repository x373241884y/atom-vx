var controller = require('./controller');
module.exports = {
	activate(state) {
		controller.log('enable plugins starting>>>>>>>');
		controller.enable(state);
	},
	deactivate(state) {
		controller.log('disable plugins starting<<<<<<<');
		controller.disable(state);
	},
	config: {
		showVxWelcome: {
			title: 'Show Vx Welcome',
			description: 'Show VX welcome panes with useful information when opening a new Atom window.',
			type: 'boolean',
			"default": false
		},
		localRequestJson: {
			title: 'Local Request Json',
			description: 'when enable this, like /local/AccountQry.do parseURL to /data/AccountQry.json',
			type: 'string',
			"default": "/local"
		},
		proxyServerConfig3000: {
			title: 'Proxy Server Config 3000',
			description: 'config proxy like nginx',
			type: 'string',
			"default": '/pmbile=>http://localhost:9998/pmbile',
		},
		proxyServerConfig4000: {
			title: 'Proxy Server Config 4000',
			description: 'config proxy like nginx',
			type: 'string',
			"default": '/pmbile=>http://localhost:9998/pmbile',
		},
		proxyServerConfig5000: {
			title: 'Proxy Server Config 5000',
			description: 'config proxy like nginx',
			type: 'string',
			"default": '/pmbile=>http://localhost:9998/pmbile',
		},
		proxyServerConfig8000: {
			title: 'Proxy Server Config 8000',
			description: 'config proxy like nginx',
			type: 'string',
			"default": '/pmbile=>http://localhost:9998/pmbile',
		},
		proxyServerConfig9000: {
			title: 'Proxy Server Config 9000',
			description: 'config proxy like nginx',
			type: 'string',
			"default": '/pmbile=>http://localhost:9998/pmbile',
		}
	}
};
