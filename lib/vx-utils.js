'use babel';
var fs = require('fs'),
	path = require('path');
export default {
	cacheFlag: false,
	template: {},
	$init: function (self, event) {
		var template = this.template;
		var packagePath = atom.packages.getPackageDirPaths()[0];
		if (!template.controller) {
			var file1 = path.join(packagePath, "atom-vx", "template", "controller.js");
			var text = fs.readFileSync(file1, 'utf8');
			template.controller = text;
		}
		if (!template.directive) {
			var file2 = path.join(packagePath, "atom-vx", "template", "directive.js");
			var text = fs.readFileSync(file2, 'utf8');
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
		} else {
			template = type;
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
	addLayoutFile: function (self, text) {
		return this.$addFile(self, text);
	},
	browserVxdesign: function (self, event) {
		console.log(event);
	}
}