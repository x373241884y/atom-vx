'use babel';

import AtomVxView from './atom-vx-view';
import { CompositeDisposable } from 'atom';
import vxUtils from './vx-utils.js';
export default {

    atomVxView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.atomVxView = new AtomVxView(state.atomVxViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.atomVxView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        var self=this;
        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'vx:toggle': function (event) {
                self.toggle();
            },
            "vx:add-controller": function (event) {
                vxUtils.addController(event);
            },
            "vx:add-directive": function (event) {
                vxUtils.addDirective(event);
            },
            "vx:browser-vxdesign": function (event) {
                vxUtils.browserVxdesign(event);
            }
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomVxView.destroy();
    },

    serialize() {
        return {
            atomVxViewState: this.atomVxView.serialize()
        };
    },

    toggle() {
        console.log('TestVx was toggled!');
        if(  this.modalPanel.isVisible()){
            this.modalPanel.hide();
        }else{
            this.modalPanel.show();
            var self = this;
            setTimeout(function () {
                self.modalPanel.hide();
            },3000);
        }
        return this;
    }

};
