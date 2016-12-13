var path = require('path');
var fs = require('fs');
var open = require('opn');
var utils = require('../utils');
var allowUnsafeEval = require('loophole').allowUnsafeEval;
var liveServer = allowUnsafeEval(function () {
	return require("live-server");
});

module.exports = ServerPlugin = {
	subscriptions: null,
	servers: null,
	controller: null,
	activate: function (ctrl) {
		this.subscriptions = ctrl.subscriptions;
		this.controller = ctrl;
		this.servers = {};
		var self = this;
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
			'vx-server:start-6000': function () {
				self.startServer(6000);
			},
			'vx-server:stop-all': function () {
				self.stopServer();
			}
		}));
		ctrl.log("activate server....");
	},
	deactivate: function (ctrl) {
		this.subscriptions = null;
		this.stopServer(ctrl);
		ctrl.log("deactivate server....");
	},
	startServer: function (port) {
		if (this.servers["server" + port]) {
			open("http://127.0.0.1:" + port, {});
		} else {
			var params, selectedPath, directoryPath, middleware = [], self = this;
			selectedPath = utils.getSelectPath();
			if (fs.existsSync(selectedPath) && fs.statSync(selectedPath).isFile()) {
				directoryPath = path.dirname(selectedPath);
			} else {
				directoryPath = selectedPath;
			}
			//parse json
			middleware.push(function (req, res, next) {
				var url = req.url, uri;
				if (/\.do(\?\w+=\w+)?$/.test(url)) {
					uri = url.replace(/.*\/(.*)\.do/, "$1.json");
					uri = path.join(directoryPath, "data", uri);
					fs.readFile(uri, "utf8", function (err, text) {
						if (err) {
							self.resposeJson(500, res, err);
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
				open: true,
				middleware: middleware
			};
			this.servers["server" + port] = allowUnsafeEval(function () {
				return liveServer.start(params);
			});
		}
	},
	stopServer: function (ctrl) {
		for (var key in this.servers) {
			if (this.servers.hasOwnProperty(key)) {
				ctrl.log("stop server...." + key);
				this.servers[key].close();
			}
		}
	},
	resposeJson(status, res, text){
		res.statusCode = status;
		var chunk = new Buffer(text, "utf8");
		res.setHeader("Content-length", chunk.length);
		res.setHeader("Content-Type", "application/json;charset:UTF-8");
		res.setHeader("Date", new Date());
		res.end(chunk, "utf8");
	}
};