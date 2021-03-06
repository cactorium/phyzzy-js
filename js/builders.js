// builders.js
// generates shapes and adds them to the mesh.

'use strict'

const Mass = require('./phyzzy/components/mass.js')
const Spring = require('./phyzzy/components/spring.js')

const FullLinkCreate = (vertices, property, spr, damp, engine) => {
    const masses = vertices.map(vertex => Mass(property, vertex, vertex))
    masses.forEach(mass => engine.addM(mass))
    engine.mesh.forEach(mass => {
        engine.mesh.forEach(otherM => {
            if (otherM !== mass && masses.find(m => m === mass) && masses.find(m => m === otherM)) {
                engine.addS(mass, otherM, Spring(mass.Pi.sub(otherM.Pi).mag(), spr, damp))
            }
        })
    })
}

const generateLine = (coordA, coordB, prop, spr, damp, eng) => {
    let segAB = {x: coordA.x - coordB.x, y: coordA.y - coordB.y}
    let restlength = Math.sqrt(segAB.x * segAB.x + segAB.y * segAB.y)
    let m1 = Mass(prop, coordA) 
    let m2 = Mass(prop, coordB) 
    eng.addM(m1)
    eng.addM(m2)
    eng.addS(m1, m2, Spring(restlength, spr, damp))
}

const generateBox = (x, y, w, h, prop, spr, damp, eng) => {
    const vertices = [
        {x: x, y: y},
        {x: x + w, y: y},
        {x: x + w, y: y + h},
        {x: x, y: y + h}
    ]
    FullLinkCreate(vertices, Object.assign({}, prop), spr, damp, eng)
}

const generateTriangle = (x, y, b, h, prop, spr, damp, eng) => {
    const vertices = [
        {x: x, y: y},
        {x: x + b, y: y},
        {x: x + b / 2, y: y + h}
    ]
    FullLinkCreate(vertices, Object.assign({}, prop), spr, damp, eng)
}

const generateBlob = (x, y, w, h, N, prop, spr, damp, eng) => {
    const randCoord = (p, l) => Math.random() * (l - p) + p
    const vertices = []
    for (let i = 0; i < N; i++) {
        vertices.push({x: randCoord(x, w), y: randCoord(y, h)})
    }
    FullLinkCreate(vertices, Object.assign({}, prop), spr, damp, eng)
}

module.exports = {
    generateLine,
    generateBox,
    generateTriangle,
    generateBlob
}