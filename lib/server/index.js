var path = require('path');
var fs = require('fs');
var open = require('opn');
var utils = require('../utils');
var allowUnsafeEval = require('loophole').allowUnsafeEval;
var liveServer;
var URL_REG = /[\w\d]+\.do(\?\s*[\w\d]+=[\w\d]+(\&\&?[\w\d]+=[\w\d]+)*)?$/;
var PROXY_REG = /(\/[\w\d]+)\s*\=>\s*(https?:\/\/.*)\s*$/;
require('http-shutdown').extend();

module.exports = ServerPlugin = {
	proxyRules: {},
	activate: function (ctrl) { //激活插件
		this.subscriptions = ctrl.subscriptions; //总控提供的事件订阅者
		this.controller = ctrl;
		this.servers = {};
		var self = this;
		//获取main.js里面的配置项,也是在setting view 里面的配置项
		var localRequestPath = atom.config.get("atom-vx.localRequestPath"); //.do本地请求data/*.json
		var proxy3000 = atom.config.get("atom-vx.proxyServerConfig3000");//对应端口代理
		var proxy4000 = atom.config.get("atom-vx.proxyServerConfig4000");
		var proxy5000 = atom.config.get("atom-vx.proxyServerConfig5000");
		var proxy8000 = atom.config.get("atom-vx.proxyServerConfig8000");
		var proxy9000 = atom.config.get("atom-vx.proxyServerConfig9000");
		var allRequestLocal = atom.config.get("atom-vx.allRequestLocal");
		this.proxyRules.local = localRequestPath || "/";
		this.proxyRules["3000"] = this.parseProxy(proxy3000);
		this.proxyRules["4000"] = this.parseProxy(proxy4000);
		this.proxyRules["5000"] = this.parseProxy(proxy5000);
		this.proxyRules["8000"] = this.parseProxy(proxy8000);
		this.proxyRules["9000"] = this.parseProxy(proxy9000);
		this.allRequestLocal = allRequestLocal; //该选项忽略所有的.do请代理，使其解析到data/*.json
		this.subscriptions.add(atom.commands.add('atom-workspace', { //添加command,菜单用快捷键控件入口
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
	deactivate: function (ctrl) { //禁用插件
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
		liveServer =liveServer|| allowUnsafeEval(function () {
			return require("live-server");
		});
		if (this.servers["server" + port]) { //已经打开的端口，直接启动
			var server = this.servers["server" + port];
			var directoryPath = server.options.root;
			this.controller.log("server root=>" + directoryPath);
			var openPath = path.relative(directoryPath, selectedPath);
			open("http://localhost:" + port + "/" + openPath, {});
		} else {
			var params, middleware = [], self = this, directoryPath;
			if (fs.existsSync(selectedPath) && fs.statSync(selectedPath).isFile()) {
				directoryPath = path.dirname(selectedPath);
			} else {
				directoryPath = selectedPath;
			}
			this.controller.log("server root=>" + directoryPath);
			var openPath = path.relative(directoryPath, selectedPath);
			//parse json
			middleware.push(function (req, res, next) { //添加一个中间件处理本地解析.do到data/*.json
				if (URL_REG.test(req.url)) { //处理.do请求
					var url = req.url, uri, prefix = self.proxyRules.local;
					var localREG = new RegExp(prefix);
					if (self.allRequestLocal || localREG.test(url)) { //标志allRequestLocal为真或符合本地前缀/local,全解析到data目录下的json
						uri = url.replace(/.*\/(.*)\.do.*/, "data/$1.json");
						uri = path.join(directoryPath, uri);
						fs.readFile(uri, "utf8", function (err, text) {
							if (err) {
								self.resposeJson(404, res, err.message);
							} else {
								self.resposeJson(200, res, text);
							}
						});
					} else {
						next();
					}
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
			params.proxy = this.proxyRules[port];//使用proxy
			var server = allowUnsafeEval(function () {
				return liveServer.start(params).withShutdown();
			});
			server.options = params;
			this.servers["server" + port] = server;
		}
	},
	stopServer: function (ctrl) { //销毁所有保藏的this.servers上的server
		liveServer.shutdown();
		for (var key in this.servers) {
			if (this.servers.hasOwnProperty(key)) {
				ctrl.log("stop server...." + key);
				this.servers[key].shutdown();
				delete this.servers[key];
			}
		}
	},
	resposeJson: function (status, res, text) { //响应json字符串
		res.statusCode = status;
		var chunk = new Buffer(text, "utf8");
		res.setHeader("Content-length", chunk.length);
		res.setHeader("Content-Type", "application/json;charset=UTF-8");
		//res.setHeader("Date", new Date());
		res.end(chunk, "utf8");
	},
	parseProxy: function (configstr) { //解析代理(代理目前编写格式  "/pmbile=>http://host:port/xxxx/.../"
		if (PROXY_REG.test(configstr)) {
			var args1 = RegExp.$1;
			var args2 = RegExp.$2;
			return [[args1, args2]];
		} else {
			return [];
		}
	}
};