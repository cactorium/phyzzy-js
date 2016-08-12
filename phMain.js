// phyzzy main webapp
'use strict'
const Phyzzy = require('./js/phyzzy/engine.js')
const Environment = require('./js/phyzzy/components/environment.js')
const User = require('./js/user.js')
const MeshBuilder = require('./js/constructor.js')

const viewport = document.getElementById('viewport')
const ctx = viewport.getContext('2d')
let delta = 1 / 50 // step time

const ph = Phyzzy(100)
const env = Environment(
    {x: 0, y: 0},
    0,
    {x: 0, y: 0, w: viewport.width / ph.scale, h: viewport.height / ph.scale}
)

const mouse = User.Mouser(ph.scale)
const builder = MeshBuilder()

mouse.init(viewport, ph)
builder.enableSet(true)
builder.massPropSet(0.1, 0.05, 0.8, 0.0, 0.4)

const frame = () => {
    ctx.clearRect(0, 0, viewport.width, viewport.height)

    ph.drawSpring(ctx, '#000000')
    ph.drawMass(ctx, '#1DB322')
    mouse.hover(ph, ctx, '#1DB322')
    mouse.select(ctx)
    builder.buildMass(ph, mouse)

    ph.verlet(
        ph.m.map(mass => {
            let f = env.weight(mass)
            .sum(env.drag(mass, delta))
            .sum(mass.springing())
            .sum(mass.damping())
            return f.sum(env.friction(mass, f))
    }), delta)
    ph.collision(ph.m.map(mass => env.boundaryHit(mass)))

    mouse.dragMass()

    ctx.fillStyle = '#000000'
    ctx.fillText('(' + mouse.coord().x + ', ' + mouse.coord().y + ')', 20, 20)
    ctx.fillText('mousedown ' + mouse.isDown(), 20, 30)

    window.requestAnimationFrame(frame)
}

frame();