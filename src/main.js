import * as THREE from 'three'

import ExtendedMesh from 'common/ExtendedMesh'

import SomeMesh from './modules/SomeObject/SomeMesh'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener(
    'resize',
    e => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        console.log(camera.aspect)
    },
    false
)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
camera.position.set(10, 10, 10)
camera.lookAt(scene.position)

// scene.add(new SomeMesh())

document.getElementById('app').append(renderer.domElement)

console.log('i am main')

require('three-instanced-mesh')(THREE)

//geometry to be instanced
var boxGeometry = new THREE.BoxBufferGeometry(2, 2, 2, 1, 1, 1)
var sphereGeometry = new THREE.SphereGeometry(2, 100, 50)
//material that the geometry will use
var material = new THREE.MeshBasicMaterial()

//the instance group
var cluster = new THREE.InstancedMesh(
    boxGeometry, //this is the same
    material,
    1000, //instance count
    false, //is it dynamic
    false, //does it have color
    true //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
)
// window.cluster = cluster
var _v3 = new THREE.Vector3()
var _q = new THREE.Quaternion()

for (var i = 0; i < 10000; i++) {
    cluster.setQuaternionAt(i, _q)
    cluster.setPositionAt(
        i,
        _v3.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        )
    )
    cluster.setScaleAt(i, _v3.set(1, 1, 1))
}
cluster.needsUpdate()

// scene.add(cluster)

import NormalMaterial from 'common/ChunkMaterial/NormalMaterial'
import BasicMaterial from 'common/ChunkMaterial/BasicMaterial'
import LambertMaterial from 'common/ChunkMaterial/LambertMaterial'
import PhongMaterial from 'common/ChunkMaterial/PhongMaterial'
import StandardMaterial from 'common/ChunkMaterial/StandardMaterial'

const normalMap = new THREE.TextureLoader().load(
    require('modules/waternormals.jpg')
)
const displacementMap = new THREE.TextureLoader().load(
    require('modules/water.jpg')
)

// debugger
const mesh = new THREE.Mesh(
    sphereGeometry,
    // new BasicMaterial({
    // new LambertMaterial({
    new StandardMaterial({
        color: 'red',
        map: displacementMap,
        normalMap,
        metalness: 0
        // displacementMap
    })
)

scene.add(mesh)

const meshD = new THREE.Mesh(
    sphereGeometry,
    // new THREE.MeshBasicMaterial({
    // new THREE.MeshLambertMaterial({
    new THREE.MeshStandardMaterial({
        color: 'red',
        map: displacementMap,
        normalMap,
        metalness: 0
        // displacementMap
    })
    // new THREE.MeshNormalMaterial()
)

scene.add(meshD)

meshD.position.x = 5

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1, 1, 1)
scene.add(light)

// mesh.material.normalScale.set(200, 2)
// meshD.material.normalScale.set(200, 2)
// mesh.material.wireframe = true
// meshD.material.wireframe = true

function animate() {
    requestAnimationFrame(animate)

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()

require('three/examples/js/controls/OrbitControls.js')
var controls = new THREE.OrbitControls(camera, renderer.domElement)
