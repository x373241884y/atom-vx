var fs = require('fs'),
	path = require('path');
module.exports = {
	cacheFlag: false,
	template: {},
	$init: function (self, event) {
		var template = this.template, file;
		var packagePath = atom.packages.getPackageDirPaths()[0];
		if (!template.controller) {
			file = path.join(packagePath, "atom-vx", "template", "controller.js");
			template.controller = fs.readFileSync(file, 'utf8');
		}
		if (!template.directive) {
			file = path.join(packagePath, "atom-vx", "template", "directive.js");
			template.directive = text = fs.readFileSync(file, 'utf8');
		}
		this.cacheFlag = true;
	},
	$addFile: function (self, type) {
		var template, filePath, tree_view, filePath;

		if (!this.cacheFlag) {
			this.$init(self);
		}
		tree_view = atom.packages.getActivePackage('tree-view').mainModule;
		filePath = tree_view.treeView.selectedPath;

		AddDialog = require('./dialog/add-dialog');
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
};