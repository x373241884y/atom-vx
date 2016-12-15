var fs = require('fs'),
	path = require('path'),
	$ = require('space-pen').jQuery,
	utils = require('./utils');
exec = require('child_process').exec;
module.exports = {
	_self: null,
	packageSelfPath: null,
	template: null,
	view: null,
	terminalConfig: null,
	$initService: function (ctrl) { //初始化一些参数
		this._self = ctrl;
		this.packageSelfPath = ctrl.packageSelfPath;
		this.view = {};
		this.terminalConfig = {
			linux: 'xfce4-terminal --default-working-directory',
			windows: 'cmd'
		};
		this.view.AddDialog = require('./dialog/add-dialog');
		ctrl.log('$initService');
	},
	$destoryService: function (ctrl) { //销毁一些参数
		this.packageSelfPath = null;
		this.template = null;
		this.view = null;
		this.terminalConfig = null;
		ctrl.log("$destoryService");
	},
	$getTemplate: function (type) { //获取模板内容
		if (!this.template) {
			var tpls = this.template = {}, file;
			file = path.join(this.packageSelfPath, "template", "controller.js");
			tpls.controller = fs.readFileSync(file, 'utf8');
			file = path.join(this.packageSelfPath, "template", "directive.js");
			tpls.directive = fs.readFileSync(file, 'utf8');
			file = path.join(this.packageSelfPath, "template", "html5.html");
			tpls.html5 = fs.readFileSync(file, "utf8");
		}
		return this.template[type];
	},
	$addFile: function (event, type, ext) {
		var template, filepath, AddDialog, dialog;
		filepath = utils.getSelectPath();
		AddDialog = this.view.AddDialog;
		if (type == "controller" || type == "directive" || type == "html5") {
			template = this.$getTemplate(type);
		} else {
			template = type;
		}
		dialog = new AddDialog({ //打开文件名输入对话框
			initialPath: filepath,
			isCreatingFile: true,
			fillContent: function (newPath) { //填充内容回调(有时需要使用文件名处理下模板内容
				var ControlName = path.basename(newPath).replace(/\.[a-zA-Z]+$/, "");
				if (ControlName) {
					return template.replace(/LoginCtrl/, ControlName);
				}
				return template;
			},
			fileNameHandle: function (newPath) {//文件扩展名处理,没有扩展名添加扩展名
				var regex = new RegExp(ext + "$");
				if (regex.test(newPath)) {
					return newPath;
				} else {
					return newPath + ext;
				}
			}
		});

		dialog.on('file-created', function (event, createdPath) { //文件创建后打开
			atom.workspace.open(createdPath);
			return false;
		});
		return dialog.attach();
	},
	openTerminal: function (event) { //打开终端的处理逻辑
		var dirpath,
			filepath,
			terminal,
			platform = process.platform;
		filepath = utils.getSelectPath();
		if (fs.lstatSync(filepath).isFile()) {
			dirpath = path.dirname(filepath);
		} else if (fs.lstatSync(filepath).isDirectory()) {
			dirpath = filepath;
		}
		if (!dirpath) {
			return;
		}
		if (platform == "linux") {
			terminal = this.terminalConfig.linux;
			return exec(terminal + " " + dirpath);
		} else if (platform == "win32" || platform == "win64") {
			terminal = this.terminalConfig.windows;
			return exec("start /D " + dirpath + " " + terminal);
		}
	},
	addHtml5: function (event) { //添加html5模板的逻辑
		return this.$addFile(event, "html5", ".html");
	},
	addController: function (event) {//添加controller模板的逻辑
		return this.$addFile(event, "controller", ".js");
	},
	addDirective: function (event) { //添加directive模板的逻辑
		return this.$addFile(event, "directive", ".js");
	},
	addLayoutFile1: function (event, text) {
		var filepath, AddDialog, dialog;
		filepath = utils.getSelectPath();
		AddDialog = this.view.AddDialog;
		dialog = new AddDialog({
			initialPath: filepath,
			isCreatingFile: true,
			fillContent: function (newPath) {
				var oclazyloadPath, pathRelativeProject, ctrlName, wraper1, wraper2;
				oclazyloadPath = newPath.replace(/\.html$/, ".js");
				pathRelativeProject = atom.project.relativizePath(oclazyloadPath)[1];
				pathRelativeProject = pathRelativeProject.replace(/\\/g, "/");
				ctrlName = newPath && newPath.replace(/^.*[\/\\](.*)\.html$/, "$1Ctrl");

				wraper1 = $("<div>\n</div>");
				wraper2 = $("<div>\n</div>");
				wraper1.attr("oc-lazy-load", pathRelativeProject);
				wraper2.attr("v-controller", ctrlName);
				wraper2.append(text);
				wraper1.append(wraper2);
				return wraper1.prop("outerHTML");
			},
			fileNameHandle: function (newPath) {
				if (/\.html$/.test(newPath)) {
					return newPath;
				} else {
					return newPath + ".html";
				}
			}
		});
		var controllerTpl = this.$getTemplate("controller");
		dialog.on('file-created', function (event, createdPath) {
			var jsPath = createdPath.replace(/\.html$/, ".js");
			var ctrlName = createdPath.replace(/^.*[\/\\](.*)\.html$/, "$1Ctrl");
			var controllerText = controllerTpl.replace(/LoginCtrl/, ctrlName);
			fs.writeFileSync(jsPath, controllerText || '');
			atom.workspace.open(createdPath);
			return false;
		});
		return dialog.attach();
	},
	addLayoutFile2: function (event, text) {
		return this.$addFile(event, text, ".html");
	}


};