// constructor.js
// creates objects for phyzzy mesh
'use strict'

const Mass = require('./phyzzy/components/mass.js')
const Spring = require('./phyzzy/components/spring.js')

const mProps = () => ({mass: 0.1, rad: 0.05, refl: 0.8, mu_k: 0.4, mu_s: 0.0})

let wasDown = false // tracks mouse button from last frame

const MassMaker = state => ({
    buildMass: phyzzy => {
        return 0
    }
})
const SpringMaker = state => ({
    buildSpring: (phyzzy, ctx) => {

    }
})

const ModeSetter = state => ({
    enable: active => state.enabled = false
})

const MeshBuilder = (mouse) => {
    const state = {
        mouse,
        enabled: false,
        lastLink: undefined
    }
    return Object.assign(
        {},
        MassMaker(state),
        MassMaker(state),
        SpringMaker(state),
        ModeSetter(state)
    )
}

module.exports = MeshBuilder
