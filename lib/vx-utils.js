'use babel';
export default {
    addController: function (event) {
        console.log(atom);
        atom.workspace.observeTextEditors(function (editor) {
            editor.insertText('Hello World')
        });
        console.log(event);
    },
    addDirective: function (event) {
        alert(2);
        console.log(event);
    },
    browserVxdesign: function (event) {
        alert(3);
        console.log(event);
    }
}