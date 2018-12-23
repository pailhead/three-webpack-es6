import * as THREE from 'three'

const dummyGeometry = new THREE.BufferGeometry()
dummyGeometry.addAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(3), 3)
)
const _m40 = new THREE.Matrix4()
const _m41 = new THREE.Matrix4()

class VirtualGroup {
    constructor(node) {
        this._node = node

        this._isVirtualGroup = true
        this._instanceCount = 0

        this._node.traverse(this._initMatrices)
    }

    createInstance() {
        const _instance = new THREE.Mesh(dummyGeometry) //so we can call onBeforeRender

        this._node.traverse(o => {
            o.userData.virtualMatrices[_instance.uuid] = new THREE.Matrix4()
        })

        const _virtualScene = new THREE.Scene()

        _virtualScene.autoUpdate = false
        // _instance.add(_virtualScene) //dont need because ill skip over?

        _virtualScene.children.push(this._node) //link manually

        _instance.onBeforeRender = function(renderer, parentScene, mainCamera) {
            // _virtualScene.add(this._node)
            renderer.render(_virtualScene, mainCamera)
            // _virtualScene.remove(this._node)
        }.bind(this)

        //do _node update before this
        _instance.updateVirtualMatrix = function() {
            this._node.traverse(o => {
                o.userData.virtualMatrices[instance.uuid].multiplyMatrices(
                    _instance.matrixWorld,
                    o.matrixWorld
                )
            })
        }.bind(this)

        this._instanceCount++
        return _instance
    }

    destroyInstance(instance) {
        this._instanceCount--

        this._node.traverse(o => {
            delete o.userData.virtualMatrices[instance.uuid]
        })
    }

    _initMatrices(o) {
        o.userData.virtualMatrices = {}
        o.userData.ownMatrixWorld = new THREE.Matrix4()
        o.onBeforeRender = (renderer, virtualScene) => {
            if (o.userData.virtualMatrices[virtualScene.uuid])
                o.matrixWorld.copy(
                    o.userData.virtualMatrices[virtualScene.uuid]
                )
        }
        // o.onAfterRender //i just need to read?
    }
}

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const onResize = e => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    console.log(camera.aspect)
}
window.addEventListener('resize', onResize, false)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
camera.position.set(10, 10, 10)
camera.lookAt(scene.position)

const clock = new THREE.Clock()

document.getElementById('app').append(renderer.domElement)

const group = new THREE.Group()
const bg = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)

for (let i = 0; i < 4; i++) {
    const a = i / 4 * Math.PI * 2

    const m = new THREE.Mesh(
        bg,
        new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i / 4, 1, 0.5)
        })
    )
    m.scale.multiplyScalar(0.5)
    m.position.x = Math.sin(a)
    m.position.y = Math.cos(a)

    m.name = `subNode_${i}`
    group.add(m)

    m.updateWorldMatrix()
}

scene.add(group)

const virtual = new VirtualGroup(group)

//main update loop updates this as it's still a regular node
let time = 0
group.children[0].onWillUpdate = function(delta) {
    time += delta
    this.position.z += Math.cos(time * 6) * 0.01
    this.position.y += Math.sin(time * 6) * 0.01
    this.matrixWorldNeedsUpdate = true
}.bind(group.children[0])

//layout for instances
const SIZE = 10

scene.autoUpdate = false

for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
        const node = new THREE.AxisHelper(1)

        const r = Math.random()
        const d0 = r > 0.5 ? -1 : 1
        const d1 = Math.random() > 0.5 ? -1 : 1
        const f = r * 0.5 + 0.5
        const onWillUpdate = function(delta) {
            this.rotation.x += f * d0 * delta
            this.rotation.y += f * d1 * delta
            this.matrixWorldNeedsUpdate = true
        }.bind(node)

        node.onWillUpdate = onWillUpdate

        node.name = `subNode_${i}_${j}`

        node.position.x = i / (SIZE - 1) * 2 - 1
        node.position.z = j / (SIZE - 1) * 2 - 1
        node.position.multiplyScalar(15)
        scene.add(node)

        const virtualInstance = virtual.createInstance()

        scene.add(virtualInstance)
    }
}

require('three/examples/js/controls/OrbitControls.js')
var controls = new THREE.OrbitControls(camera, renderer.domElement)

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    //main update loop
    scene.traverse(o => {
        if (o.onWillUpdate) o.onWillUpdate(delta) //sets dirty inside
        if (o.matrixWorldNeedsUpdate) {
            o.updateWorldMatrix()
            o.matrixWorldNeedsUpdate = false
        }
    })
    render()
}

function render() {
    renderer.render(scene, camera)
}

onResize()

animate()
