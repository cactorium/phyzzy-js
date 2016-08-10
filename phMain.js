// phyzzy main webapp
'use strict'
const Phyzzy = require('./js/phyzzy/engine.js')
const Mass = require('./js/phyzzy/components/mass.js')
const Spring = require('./js/phyzzy/components/spring.js')
const Environment = require('./js/phyzzy/components/environment.js')

const viewport = document.getElementById('viewport')
const ctx = viewport.getContext('2d')
let delta = 1 / 50 // step frequency

const ph = Phyzzy(100)
const env = Environment(
    {x: 0, y: 9.81},
    0,
    {x: 0, y: 0, w: viewport.width / ph.scale, h: viewport.height / ph.scale}
)
const m1 = Mass(
        {mass: 0.1, rad: 0.05, refl: 0.75, mu_s: 0.8, mu_k: 0.4},
        {x: viewport.width / 2 / ph.scale, y: 0.05},
        {x: 2.4, y: 0.05}
    )
const m2 = Mass(
        {mass: 0.1, rad: 0.05, refl: 0.75, mu_s: 0.8, mu_k: 0.4},
        {x: viewport.width / 2 / ph.scale, y: 0.05},
        {x: 2.6, y: 0.05}
    )
const m3 = Mass(
        {mass: 0.1, rad: 0.05, refl: 0.75, mu_s: 0.8, mu_k: 0.4},
        {x: viewport.width / 2 / ph.scale, y: 0.05},
        {x: 2.6, y: 0.1}
    )
const s1 = Spring(1, 100, 50)
const s2 = Spring(1, 100, 50)
const s3 = Spring(1, 100, 50)

ph.addM(m1)
ph.addM(m2)
ph.addM(m3)
ph.addS(m1, m2, s1)
ph.addS(m2, m3, s2)
ph.addS(m3, m1, s3)

const frame = () => {
    ctx.clearRect(0, 0, viewport.width, viewport.height)
    ph.drawSpring(ctx, '#000000')
    ph.drawMass(ctx, '#1DB322')
    
    
    ph.verlet(
        ph.m.map(mass => {
            let f = env.weight(mass)
            .sum(env.drag(mass, delta))
            .sum(mass.springing())
            .sum(mass.damping())
            return f.sum(env.friction(mass, f))
    }), delta)
    ph.collision(ph.m.map(mass => env.boundaryHit(mass) ))

    ctx.fillStyle = '#000000'
    ctx.fillText(m1.Pi.sub(m1.Po).div(delta).display(5), 5, 495)

    window.requestAnimationFrame(frame)
}

frame();