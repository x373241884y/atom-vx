function timeCalc(tag, fn) {
	var start = Date.now();
	fn();
	var end = Date.now();
	console.log("%s use time: %d ms", tag, (end - start) / 1000);
}

var CompositeDisposable = require('atom').CompositeDisposable;
var url = require('url');
var path = require('path');
var vxService = require('./service');

//插件列表
var serverPlugin = require('./server');
var browserPlugin = require('./browser');
var dialogPlugin = require('./dialog');
var welcomePlugin = require('./welcome');

module.exports = {
	debug: true,
	packageSelfPath: null,
	packageAppsPath: null,
	subscriptions: null,
	enable: function (state) {
		//当前插件atom-vx路径
		this.packageSelfPath = path.dirname(__dirname);
		//webapp的路径
		this.packageAppsPath = path.join(this.packageSelfPath, "webapps");
		//新建一个个事件订阅者
		this.subscriptions = new CompositeDisposable();
		//初始化服务
		vxService.$initService(this);
		//插件激活
		serverPlugin.activate(this);
		browserPlugin.activate(this);
		dialogPlugin.activate(this);
		welcomePlugin.activate(this);

		this.log("enabled all success!");
	},
	disable: function (state) {
		//插件禁用
		serverPlugin.deactivate(this);
		browserPlugin.deactivate(this);
		dialogPlugin.deactivate(this);
		welcomePlugin.deactivate(this);
		//detory服务
		vxService.$destoryService(this);
		this.subscriptions.dispose();
		this.subscriptions = null;
		this.log("disabled all success!");
	},
	log: function (msg) { //记录日志
		if (this.debug) {
			msg = "atom-vx : " + msg;
			arguments[0] = msg;
			console.debug.apply(this, arguments);
		}
	},
	timeCalc: timeCalc
};