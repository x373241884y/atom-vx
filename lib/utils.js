var path = require("path");

module.exports = {
	repoForPath: function (goalPath) {
		var i, j, len, projectPath, ref;
		ref = atom.project.getPaths();
		for (i = j = 0, len = ref.length; j < len; i = ++j) {
			projectPath = ref[i];
			if (goalPath === projectPath || goalPath.indexOf(projectPath + path.sep) === 0) {
				return atom.project.getRepositories()[i];
			}
		}
		return null;
	},
	getStyleObject: function (el) {
		var camelizedAttr, property, styleObject, styleProperties, value;
		styleProperties = window.getComputedStyle(el);
		styleObject = {};
		for (property in styleProperties) {
			value = styleProperties.getPropertyValue(property);
			camelizedAttr = property.replace(/\-([a-z])/g, function (a, b) {
				return b.toUpperCase();
			});
			styleObject[camelizedAttr] = value;
		}
		return styleObject;
	},
	getFullExtension: function (filePath) {
		var extension, fullExtension;
		fullExtension = '';
		while (extension = path.extname(filePath)) {
			fullExtension = extension + fullExtension;
			filePath = path.basename(filePath, extension);
		}
		return fullExtension;
	},
	getSelectPath: function () { //获取树形菜单选中项
		var tree_view, filePath;
		tree_view = atom.packages.getActivePackage('tree-view').mainModule;
		if (tree_view && tree_view.treeView) {
			filePath = tree_view.treeView.selectedPath;
		} else {
			filePath = atom.project.getPaths()[0];
		}
		return filePath;
	}
};