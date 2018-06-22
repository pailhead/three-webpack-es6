import * as THREE from 'three'
import { parseIncludes, initParameters } from '../utils'
import vertexShader from './template.vert'
import fragmentShader from './template.frag'

/**
 * @author  pailhead / http://dusanbosnjak.com
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 * }
 */

//import chunks for three shaking?
const chunks = {
    packing: require('../Chunks/packing.glsl'),
    uv_pars_fragment: require('../Chunks/uv_pars_fragment.glsl'),
    bumpmap_pars_fragment: require('../Chunks/bumpmap_pars_fragment.glsl'),
    normalmap_pars_fragment: require('../Chunks/normalmap_pars_fragment.glsl'),
    logdepthbuf_pars_fragment: require('../Chunks/logdepthbuf_pars_fragment.glsl'),
    logdepthbuf_fragment: require('../Chunks/logdepthbuf_fragment.glsl'),
    normal_fragment_begin: require('../Chunks/normal_fragment_begin.glsl'),
    normal_fragment_maps: require('../Chunks/normal_fragment_maps.glsl'),
    uv_pars_vertex: require('../Chunks/uv_pars_vertex.glsl'),
    displacementmap_pars_vertex: require('../Chunks/displacementmap_pars_vertex.glsl'),
    morphtarget_pars_vertex: require('../Chunks/morphtarget_pars_vertex.glsl'),
    skinning_pars_vertex: require('../Chunks/skinning_pars_vertex.glsl'),
    logdepthbuf_pars_vertex: require('../Chunks/logdepthbuf_pars_vertex.glsl'),
    uv_vertex: require('../Chunks/uv_vertex.glsl'),
    beginnormal_vertex: require('../Chunks/beginnormal_vertex.glsl'),
    morphnormal_vertex: require('../Chunks/morphnormal_vertex.glsl'),
    skinbase_vertex: require('../Chunks/skinbase_vertex.glsl'),
    skinnormal_vertex: require('../Chunks/skinnormal_vertex.glsl'),
    defaultnormal_vertex: require('../Chunks/defaultnormal_vertex.glsl'),
    begin_vertex: require('../Chunks/begin_vertex.glsl'),
    morphtarget_vertex: require('../Chunks/morphtarget_vertex.glsl'),
    skinning_vertex: require('../Chunks/skinning_vertex.glsl'),
    displacementmap_vertex: require('../Chunks/displacementmap_vertex.glsl'),
    project_vertex: require('../Chunks/project_vertex.glsl'),
    logdepthbuf_vertex: require('../Chunks/logdepthbuf_vertex.glsl')
}

export default class NormalMaterial extends THREE.ShaderMaterial {
    constructor(parameters) {
        //declare parameters for this material
        const defaultParameters = {
            opacity: 1,
            bumpMap: null,
            bumpScale: 1,
            normalMap: null,
            normalScale: new THREE.Vector2(1, 1),

            displacementMap: null,
            displacementScale: 1,
            displacementBias: 0
        }

        const uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.bumpmap,
            THREE.UniformsLib.normalmap,
            THREE.UniformsLib.displacementmap,
            {
                opacity: { value: 1.0 }
            }
        ])

        //init ShaderMaterial with templates and uniforms
        super({
            uniforms,
            vertexShader,
            fragmentShader
        })

        //init parameters and wire uniforms
        initParameters(this, defaultParameters, parameters)

        //bypass three's compilation system alltogether
        this.onBeforeCompile = shader => {
            shader.vertexShader = parseIncludes(vertexShader, chunks)
            shader.fragmentShader = parseIncludes(fragmentShader, chunks)
        }

        //pass this stuff for serialization
        // this.setAdditionalParameters(parameters)
    }
}
