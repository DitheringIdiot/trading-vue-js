// Interactive canvas-based component
// Should implement: mousemove, mouseout, mouseup, mousedown, click

import Utils from '../stuff/utils.js'

export default {
    methods: {
        setupCanvas() {
            const id = `${this.$props.tv_id}-${this._id}-canvas`
            console.log(id)
            const canvas = document.getElementById(id)
            let dpr = window.devicePixelRatio || 1
            canvas.style.width = `${this._width}px`
            canvas.style.height = `${this._height}px`
            if (dpr < 1) dpr = 1 // Realy ? That's it? Issue #63
            this.$nextTick(() => {
                var rect = canvas.getBoundingClientRect()
                canvas.width = rect.width * dpr
                canvas.height = rect.height * dpr
                const ctx = canvas.getContext('2d', {
                    // TODO: test the boost:
                    //alpha: false,
                    //desynchronized: true,
                    //preserveDrawingBuffer: false
                })
                ctx.scale(dpr, dpr)
                this.redraw()
                // Fallback fix for Brave browser
                // https://github.com/brave/brave-browser/issues/1738
                if (!ctx.measureTextOrg) {
                    ctx.measureTextOrg = ctx.measureText
                }
                ctx.measureText = text =>
                    Utils.measureText(ctx, text, this.$props.tv_id)
            })
        },
        create_canvas(h, id, props) {
            this._id = id
            this._width = props.width
            this._height = props.height
            this._overflow = props.overflow
            // this.rerender = props.rerender 
            return h('div', {
                class: `trading-vue-${id}`,
                style: {
                    left: props.position.x + 'px',
                    top: props.position.y + 'px',
                    position: 'absolute',
                }
            }, [
                h('canvas', {
                    on: {
                        mousemove: e => this.renderer.mousemove(e),
                        mouseout: e => this.renderer.mouseout(e),
                        mouseup: e => this.renderer.mouseup(e),
                        mousedown: e => this.renderer.mousedown(e)
                    },
                    height: props.height,
                    width: props.width,
                    overflow: props.overflow,
                    id: `${this.$props.tv_id}-${id}-canvas`,
                    ref: 'canvas',
                    style: props.style,
                })
            ].concat(props.hs || []))
        },
        redraw() {
            if (!this.renderer) return
            this.renderer.update()
        }
    },
    watch: {
        width(val) {
            this._width = val
            this.setupCanvas()
        },
        height(val) {
            this._height = val
            this.setupCanvas()
        }
    }
}
