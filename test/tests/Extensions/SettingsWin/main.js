
// Extension's controller

import { Utils } from 'trading-vue-js'
import SettingsWin from './SettingsWin.vue'
import Vue from 'vue'

export default class Main {

    constructor(tv, dc) {
        this.widgets = {}
        this.tv = tv
        this.dc = dc
    }

    // Listens to all tvjs events, creates new widgets
    update(e) {
        switch(e.event) {
            case 'legend-button-click':
                let id = `SettingsWin-${Utils.uuid2()}`
                let args = e.args[0]
                try {
                    let ov = this.dc.data[args.type][args.dataIndex]
                    let f = Object.values(this.widgets)
                        .find(x => x.data.ov === ov)
                    if(f) {
                        // Vue 2 | this.tv.$delete(this.widgets, f.id)
                        delete this.widgets[f.id]
                        break
                    }
                    // Vue 2 | this.tv.$set(this.widgets, id, {
                    //     id, cls: SettingsWin, data: { ov: ov }
                    // })
                    this.widgets[id] = {
                        id,
                        cls: SettingsWin,
                        data: { ov: ov }
                    }
                    
                } catch(e) {
                    console.log(e)
                }
                break
        }
    }

    remove_widget(id) {
        // Vue 2 | this.tv.$delete(this.widgets, id)
        delete this.widgets[id]
    }

}
