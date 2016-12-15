var path = require('path');
var fs = require('fs');
var utils = require('../utils');
var browser = require('../browser');
/**
 * 简单的一个文件
 * @type {{subscriptions: null, controller: null, packageAppsPath: null, activate: ServerPlugin.activate, deactivate: ServerPlugin.deactivate, showWelcome: ServerPlugin.showWelcome}}
 */
module.exports = ServerPlugin = {
	subscriptions: null,
	controller: null,
	packageAppsPath: null,
	activate: function (ctrl) {
		this.subscriptions = ctrl.subscriptions;
		this.controller = ctrl;
		this.packageAppsPath = ctrl.packageAppsPath;
		var webappsRoot = this.packageAppsPath;
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			// 欢迎页
			'vx-tools:vx-welcome': function (event) {
				//console.log(webappsRoot);
				var href = path.join(webappsRoot, "vx-wel", "zh_CN", "index.html");
				browser.toggle("file://" + href, "VX-Welcome", false);
				//atom.workspace.open("file://" + href);
			},
			// 帮助文档
			'vx-tools:vx-help': function (event) {
				var href = path.join(webappsRoot, "vx-help", "index.html");
				browser.toggle("file://" + href, "VX-Help", false);
			},
			// 三个api
			'vx-tools:vx-api-core': function (event) {
				var href = "http://115.182.90.204:8082/index.html#/app/CoreAPI";
				browser.toggle(href, "VX-CoreAPI", false);
			},
			'vx-tools:vx-api-component': function (event) {
				var href = "http://115.182.90.204:8082/index.html#/app/ComponentAPI";
				browser.toggle(href, "VX-ComponentAPI", false);
			},
			'vx-tools:vx-api-extra': function (event) {
				var href = "http://115.182.90.204:8082/index.html#/app/ExtraAPI";
				browser.toggle(href, "VX-ExtraAPI", false);
			},
			// vxdesign
			'vx-tools:vx-design': function (event) {
				var href = "http://115.182.90.204:8082/index.html#/app/ClassicalDesk";
				browser.toggle(href, "VX-Design", false);
			}
		}));

		var self = this;
		if (atom.config.get('atom-vx.showVxWelcome')) {
			process.nextTick(function () {
				self.showWelcome();
			});
		}
		ctrl.log("activate welcome....");
	},
	deactivate: function (ctrl) {
		this.subscriptions = null;
		this.controller = null;
		this.packageAppsPath = null;
		ctrl.log("deactivate welcome....");
	},
	showWelcome: function () {
		var href = path.join(this.packageAppsPath, "vx-wel", "zh_CN", "index.html");
		browser.toggle("file://" + href, "VX-Welcome", false);
	}
};