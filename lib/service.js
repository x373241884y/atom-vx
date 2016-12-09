var fs = require('fs'),
	path = require('path'),
	$ = require('space-pen').jQuery,
	utils = require('./utils');
exec = require('child_process').exec;
module.exports = {
	_self: null,
	packagePath: null,
	template: null,
	view: {},
	terminalConfig: {
		linux: 'xfce4-terminal --default-working-directory',
		windows: 'cmd'
	},
	$initService: function (ctrl) {
		var packagePath;
		packagePath = atom.packages.getPackageDirPaths()[0];
		this._self = ctrl;
		this.packagePath = packagePath;
		this.view.AddDialog = require('./dialog/add-dialog');
	},
	$getTemplate: function (type) {
		if (!this.template) {
			var tpls = this.template = {}, file;
			if (!tpls.controller) {
				file = path.join(this.packagePath, "atom-vx", "template", "controller.js");
				tpls.controller = fs.readFileSync(file, 'utf8');
			}
			if (!tpls.directive) {
				file = path.join(this.packagePath, "atom-vx", "template", "directive.js");
				tpls.directive = text = fs.readFileSync(file, 'utf8');
			}
		}
		return this.template[type];
	},
	$addFile: function (event, type, ext) {
		var template, filepath, AddDialog, dialog;
		filepath = utils.getSelectPath();
		AddDialog = this.view.AddDialog;
		if (type == "controller" || type == "directive") {
			template = this.$getTemplate(type);
		} else {
			template = type;
		}
		dialog = new AddDialog({
			initialPath: filepath,
			isCreatingFile: true,
			fillContent: function (newPath) {
				var ControlName = newPath && newPath.replace(/^.*\//, "").replace(/\.js$/, "");
				if (ControlName) {
					return template.replace(/LoginCtrl/, ControlName);
				}
				return template;
			},
			fileNameHandle: function (newPath) {
				var regex = new RegExp(ext + "$");
				if (regex.test(newPath)) {
					return newPath;
				} else {
					return newPath + ext;
				}
			}
		});

		dialog.on('file-created', function (event, createdPath) {
			atom.workspace.open(createdPath);
			return false;
		});
		return dialog.attach();
	},
	openTerminal: function (event) {
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
		} else if (platform == "windows") {
			terminal = this.terminalConfig.windows;
			return exec("start /D " + dirpath + " " + terminal);
		}
	},

	addController: function (event) {
		return this.$addFile(event, "controller", ".js");
	},
	addDirective: function (event) {
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
				ctrlName = newPath && newPath.replace(/^.*\/(.*)\.html$/, "$1Ctrl");

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
		var controllerTpl = this.template.controller;
		dialog.on('file-created', function (event, createdPath) {
			var jsPath = createdPath.replace(/\.html$/, ".js");
			var ctrlName = createdPath.replace(/^.*\/(.*)\.html$/, "$1Ctrl");
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