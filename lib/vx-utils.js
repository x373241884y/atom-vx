'use babel';
var fs = require('fs'),
	path = require('path');

export default {
	cacheFlag: false,
	template: {},
	$init: function (self, event) {
		var template = this.template;
		if (!template.controller) {
			var text = fs.readFileSync("/home/toor/github/atom-vx/template/controller.js", 'utf8');
			template.controller = text;
		}
		if (!template.directive) {
			var text = fs.readFileSync("/home/toor/github/atom-vx/template/directive.js", 'utf8');
			template.directive = text;
		}
		this.cacheFlag = true;
	},
	$addFile: function (self, type) {
		if (!this.cacheFlag) {
			this.$init(self);
		}
		var template, filePath;
		var tree_view = atom.packages.getActivePackage('tree-view').mainModule;
		var filePath = tree_view.treeView.selectedPath;
		AddDialog = require('./add-dialog');
		if (type === "controller") {
			template = this.template.controller;
		} else if (type === "directive") {
			template = this.template.directive;
		}
		dialog = new AddDialog(filePath, true, template);

		dialog.on('file-created', function (event, createdPath) {
			atom.workspace.open(createdPath);
			return false;
		});
		return dialog.attach();
	},
	addController: function (self, event) {
		return this.$addFile(self, "controller");
	},
	addDirective: function (self, event) {
		return this.$addFile(self, "directive");
	},
	browserVxdesign: function (self, event) {
		if (!this.cacheFlag) {
			this.init(self);
		}
		if (!this.cacheFlag) {
			this.init(self);
		}
		alert(3);
		console.log(event);
	}
}

function isFile(path) {
	return fs.existsSync(path) && fs.statSync(path).isFile();
}