// Generated by CoffeeScript 1.12.0
(function () {
	var AddDialog, Dialog, fs, path, repoForPath,
		extend = function (child, parent) {
			for (var key in parent) {
				if (hasProp.call(parent, key)) child[key] = parent[key];
			}
			function ctor() {
				this.constructor = child;
			}

			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		},
		hasProp = {}.hasOwnProperty;

	path = require('path');

	fs = require('fs-plus');

	Dialog = require('./dialog');

	repoForPath = require('../utils').repoForPath;

	module.exports = AddDialog = (function (superClass) {
		extend(AddDialog, superClass);

		function AddDialog(options) {
			var directoryPath, ref, relativeDirectoryPath, initialPath, isCreatingFile;
			this.initialPath = initialPath = options.initialPath;
			this.isCreatingFile = isCreatingFile = options.isCreatingFile;
			this.fillContent = options.fillContent;
			this.fileNameHandle = options.fileNameHandle;

			if (fs.isFileSync(initialPath)) {
				directoryPath = path.dirname(initialPath);
			} else {
				directoryPath = initialPath;
			}
			ref = atom.project.relativizePath(directoryPath);
			this.rootProjectPath = ref[0];
			relativeDirectoryPath = ref[1];
			if (relativeDirectoryPath.length > 0) {
				relativeDirectoryPath += path.sep;
			}
			AddDialog.__super__.constructor.call(this, {
				prompt: "Enter the path for the new " + (isCreatingFile ? "file." : "folder."),
				initialPath: relativeDirectoryPath,
				select: false,
				iconClass: isCreatingFile ? 'icon-file-add' : 'icon-file-directory-create'
			});
		}

		AddDialog.prototype.onConfirm = function (newPath) {
			var endsWithDirectorySeparator, error, ref;
			newPath = newPath.replace(/\s+$/, '');
			endsWithDirectorySeparator = newPath[newPath.length - 1] === path.sep;
			if (!path.isAbsolute(newPath)) {
				if (this.rootProjectPath == null) {
					this.showError("You must open a directory to create a file with a relative path");
					return;
				}
				newPath = path.join(this.rootProjectPath, newPath);
			}
			if (!newPath) {
				return;
			}
			if (this.isCreatingFile && this.fileNameHandle) {
				newPath = this.fileNameHandle.apply(this, [newPath]);
			}

			try {
				if (fs.existsSync(newPath)) {
					return this.showError("'" + newPath + "' already exists.");
				} else if (this.isCreatingFile) {
					if (endsWithDirectorySeparator) {
						return this.showError("File names must not end with a '" + path.sep + "' character.");
					} else {
						if (typeof this.fillContent == "function") {
							this.fillContent = this.fillContent.apply(this, [newPath]);
						}
						fs.writeFileSync(newPath, this.fillContent || '');
						if ((ref = repoForPath(newPath)) != null) {
							ref.getPathStatus(newPath);
						}
						this.trigger('file-created', [newPath]);
						return this.close();
					}
				} else {
					fs.makeTreeSync(newPath);
					this.trigger('directory-created', [newPath]);
					return this.cancel();
				}
			} catch (error1) {
				error = error1;
				return this.showError(error.message + ".");
			}
		};

		return AddDialog;

	})(Dialog);

}).call(this);
