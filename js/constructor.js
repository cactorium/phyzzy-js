// constructor.js
// creates objects for phyzzy mesh
'use strict'

const Mass = require('./phyzzy/components/mass.js')
const Spring = require('./phyzzy/components/spring.js')

const MassMaker = state => ({
    buildMass: (phyzzy, mouse) => {

        if (state.enabled && mouse.isDown() && !state.wasDown) {
            if (!mouse.actionOn().hov) {
                state.wasDown = true
                phyzzy.addM(Mass(state.mProp, mouse.coord(), mouse.coord()))
            }
        }

        if (!mouse.isDown() && state.wasDown) {
            state.wasDown = false
        }
    }
})
const SpringMaker = state => ({
    buildSpring: (phyzzy, mouse, ctx) => {

    }
})

const ModeSetter = state => ({
    enableSet: active => state.enabled = active
})

const ComponentPropertySetter = state => ({
    massPropSet: (mass, rad, refl, mu_s, mu_k) => state.mProp = {mass, rad, refl, mu_s, mu_k}
})

const Outputs = state => ({
    isEnabled: () => state.enabled
})

const MeshBuilder = () => {
    const state = {
        enabled: false,
        lastLink: undefined,
        wasDown: false,
        mProp: undefined
    }
    return Object.assign(
        {},
        MassMaker(state),
        MassMaker(state),
        SpringMaker(state),
        ModeSetter(state),
        ComponentPropertySetter(state)
    )
}

module.exports = MeshBuilder
