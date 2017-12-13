import * as THREE from 'three'
import vert from './my.vert' //TODO: didn't refresh with require
import frag from './my.frag'

class ExtShaderMaterial extends THREE.ShaderMaterial {
    constructor(params) {
        super({
            vertexShader: vert,
            fragmentShader: frag
        })
    }
}

export default class SomeMesh extends THREE.Mesh {
    constructor() {
        super(new THREE.BoxGeometry(2, 2, 2), new ExtShaderMaterial())

        this.textureUrl = require('./grid.jpg') //you'd myLoader.load(this.textureUrl)
    }
}
