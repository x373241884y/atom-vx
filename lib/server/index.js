var path = require('path');
var fs = require('fs');
var open = require('opn');
var utils = require('../utils');
var allowUnsafeEval = require('loophole').allowUnsafeEval;
var liveServer = allowUnsafeEval(function () {
	return require("live-server");
});
var urlREG = /[\w\d]+\.do(\?\s*[\w\d]+=[\w\d]+(\&\&?[\w\d]+=[\w\d]+)*)?$/;
var proxyREG = /(\/[\w\d]+)\s*\=>\s*(https?:\/\/.*)\s*$/;
module.exports = ServerPlugin = {
	subscriptions: null,
	servers: null,
	controller: null,
	proxyRules: {},
	activate: function (ctrl) {
		this.subscriptions = ctrl.subscriptions;
		this.controller = ctrl;
		this.servers = {};
		var self = this;
		var localRequestPath = atom.config.get("atom-vx.localRequestJson");
		var proxy3000 = atom.config.get("atom-vx.proxyServerConfig3000");
		var proxy4000 = atom.config.get("atom-vx.proxyServerConfig4000");
		var proxy5000 = atom.config.get("atom-vx.proxyServerConfig5000");
		var proxy8000 = atom.config.get("atom-vx.proxyServerConfig8000");
		var proxy9000 = atom.config.get("atom-vx.proxyServerConfig9000");
		this.proxyRules.local = localRequestPath || "/";
		this.proxyRules["3000"] = this.parseProxy(proxy3000);
		this.proxyRules["4000"] = this.parseProxy(proxy4000);
		this.proxyRules["5000"] = this.parseProxy(proxy5000);
		this.proxyRules["8000"] = this.parseProxy(proxy8000);
		this.proxyRules["9000"] = this.parseProxy(proxy9000);
		console.log(this.proxyRules);
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'vx-server:start-3000': function () {
				self.startServer(3000);
			},
			'vx-server:start-4000': function () {
				self.startServer(4000);
			},
			'vx-server:start-5000': function () {
				self.startServer(5000);
			},
			'vx-server:start-8000': function () {
				self.startServer(8000);
			},
			'vx-server:start-9000': function () {
				self.startServer(9000);
			},
			'vx-server:stop-all': function () {
				self.stopServer(ctrl);
			}
		}));
		ctrl.log("activate server....");
	},
	deactivate: function (ctrl) {
		this.subscriptions = null;
		this.controller = null;
		this.stopServer(ctrl);
		this.servers = null;
		this.proxyRules = {};
		ctrl.log("deactivate server....");
	},
	startServer: function (port) {
		var selectedPath;
		selectedPath = utils.getSelectPath();

		if (this.servers["server" + port]) {
			var server = this.servers["server" + port];
			var directoryPath = server.options.root;
			var openPath = path.relative(directoryPath, selectedPath);
			open("http://127.0.0.1:" + port + "/" + openPath, {});
		} else {
			var params, middleware = [], self = this, directoryPath;
			if (fs.existsSync(selectedPath) && fs.statSync(selectedPath).isFile()) {
				directoryPath = path.dirname(selectedPath);
			} else {
				directoryPath = selectedPath;
			}
			var openPath = path.relative(directoryPath, selectedPath);
			//parse json
			middleware.push(function (req, res, next) {
				var url = req.url, uri, prefix = self.proxyRules.local;
				var localREG = new RegExp(prefix);
				if (localREG.test(url)) {
					uri = url.replace(/.*\/(.*)\.do.*/, "data/$1.json");
					uri = path.join(directoryPath, uri);
					fs.readFile(uri, "utf8", function (err, text) {
						if (err) {
							self.resposeJson(500, res, err.message);
						} else {
							self.resposeJson(200, res, text);
						}
					});
				} else {
					next();
				}
			});
			params = {
				port: port,
				root: directoryPath,
				open: "/" + openPath,
				middleware: middleware,
				logLevel: 1
			};
			params.proxy = this.proxyRules[port];
			var server = allowUnsafeEval(function () {
				return liveServer.start(params);
			});
			server.options = params;
			this.servers["server" + port] = server;
		}
	},
	stopServer: function (ctrl) {
		for (var key in this.servers) {
			if (this.servers.hasOwnProperty(key)) {
				ctrl.log("stop server...." + key);
				this.servers[key].close();
				delete this.servers[key];
			}
		}
	},
	resposeJson: function (status, res, text) {
		res.statusCode = status;
		var chunk = new Buffer(text, "utf8");
		res.setHeader("Content-length", chunk.length);
		res.setHeader("Content-Type", "application/json;charset:UTF-8");
		res.setHeader("Date", new Date());
		res.end(chunk, "utf8");
	},
	parseProxy: function (configstr) {
		if (proxyREG.test(configstr)) {
			var args1 = RegExp.$1;
			var args2 = RegExp.$2;
			return [[args1, args2]];
		} else {
			return [];
		}
	}
};