// user.js
// mousing functions for user interaction
'use strict'
const Vect = require('./phyzzy/components/vector.js')
const highlightRadius = 5
const padding = 10

const Highlighter = state => ({
    hover: (phyzzy, ctx, hColor) => {
        ctx.strokeStyle = hColor || '#000000'
        
        if (state.hov && state.sel !== state.hov) {
            ctx.beginPath()
            ctx.arc(
                state.hov.Pi.x * state.scale,
                state.hov.Pi.y * state.scale,
                state.hov.rad * state.scale + highlightRadius,
                0, 2 * Math.PI
            )
            ctx.stroke()
            ctx.closePath()
        }
        return state.hov
    },
    select: (ctx, sColor) => {
        ctx.strokeStyle = sColor || '#000000'

        if (state.sel) {
            ctx.beginPath()
            ctx.arc(
                state.sel.Pi.x * state.scale,
                state.sel.Pi.y * state.scale,
                state.sel.rad * state.scale + highlightRadius,
                0, 2 * Math.PI, false
            )
            ctx.stroke()
            ctx.closePath()
        }
        return state.sel
    } 
})

const Mover = state => ({
    dragMass: isPaused => {
        if (state.sel && state.mousedown && state.hov === state.sel || state.drg) {
            if (!state.drg) state.drg = state.sel 
            state.sel.Pi.equ(state.Pi.div(state.scale))
            // prevents unwanted speed changes after getting out of pause mode.
            if (isPaused || state.drg.fixed) state.sel.Po.equ(state.Pi.div(state.scale))
            
        }
    }
})

const Initializer = state => ({
    init: (canvas, phyzzy) => {

        canvas.onmousedown = e => {
            // actions when mouse has been clicked
            if (!state.mousedown) state.mousedown = true

            const isOnHov = state.hov ? state.hov.Pi.compare(
                state.Pi.div(state.scale), state.hov.rad + padding / state.scale
            ) : false

            if (isOnHov && state.sel !== state.hov) {
                state.sel = state.hov
            } else {
                state.sel = undefined
                state.hov = undefined
            }
        }
        canvas.onmouseup = e => {
            // actions when mouse stops clicking
            if (state.mousedown) state.mousedown = false
            if (state.drg) state.drg = undefined
        }

        canvas.onmouseenter = e => {
            state.drg = undefined
            state.mousedown = false
        }

        canvas.onmousemove = e => {
            // actions when mouse moves in the canvas
            const b = canvas.getBoundingClientRect()
            state.Po.equ(state.Pi)
            state.Pi.equ({
                x: e.clientX - b.left,
                y: e.clientY - b.top
            })

            state.hov = phyzzy.mesh.find(
                m => m.Pi.compare(
                    state.Pi.div(state.scale),
                    m.rad + padding / state.scale
                )
            )
        }

    }
})

const Output = state => ({
    coord: scale => state.Pi.div(scale || state.scale),
    isDown: () => state.mousedown,
    dragging: () => state.drg
})

const Mouser = scale => {
    const state = {
        Pi: new Vect(0, 0),
        Po: new Vect(0, 0),
        scale,
        mousedown: false,
        hov: undefined,
        sel: undefined,
        drg: undefined
    }
    return Object.assign(
        {},
        Initializer(state),
        Highlighter(state),
        Mover(state),
        Output(state)
    )
}

module.exports = {
    Mouser
}