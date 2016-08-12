// constructor.js
// creates objects for phyzzy mesh
'use strict'

const Mass = require('./phyzzy/components/mass.js')
const Spring = require('./phyzzy/components/spring.js')

const mProps = () => ({mass: 0.1, rad: 0.05, refl: 0.8, mu_k: 0.4, mu_s: 0.0})

let wasDown = false // tracks mouse button from last frame

const Construct = (phyzzy, mouse, enable) => {
    let linkfrom = undefined
    let massCount = 0
    if (mouse.isDown() && !wasDown) {
        wasDown = true
        if (enable && !mouse.actionOn().hov) {
            massCount = phyzzy.addM(Mass(
                mProps(),
                mouse.coord(),
                mouse.coord()
            ))
        }
    } else if (!mouse.isDown() && wasDown) {
            wasDown = false
    }
}

module.exports = Construct