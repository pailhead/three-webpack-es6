import * as THREE from 'three'

console.log('ive been imported with an absolute path')

export default class ExtendedMesh extends THREE.Mesh {
    constructor() {
        super()

        this.isExtendedMesh = true
    }
}
