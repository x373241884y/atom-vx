'use babel';

export default {
	addController: function (self, event) {
		self.addFileDialog.show();
		console.log(event);
	},
	addDirective: function (self, event) {
		alert(2);
		console.log(event);
	},
	browserVxdesign: function (self, event) {
		alert(3);
		console.log(event);
	}
}