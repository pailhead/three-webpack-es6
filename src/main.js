import * as THREE from 'three'

import ExtendedMesh from 'common/ExtendedMesh'

import SomeMesh from './modules/SomeObject/SomeMesh'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
camera.position.set(10, 10, 10)
camera.lookAt(scene.position)

scene.add(new SomeMesh())

document.getElementById('app').append(renderer.domElement)

console.log('i am main')

console.log(
    'this should have a texture in /images/name-[hash].[ext] ->',
    new SomeMesh()
)

renderer.render(scene, camera)
// renderer.render(new THREE.Scene(), new THREE.Camera())
