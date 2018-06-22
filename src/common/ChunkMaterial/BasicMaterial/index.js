import * as THREE from 'three'
import { parseIncludes, initParameters } from '../utils'
import vertexShader from './template.vert'
import fragmentShader from './template.frag'

/**
 * @author  pailhead / http://dusanbosnjak.com
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.CubeTexture( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 * }
 */

//import chunks for three shaking?
var chunks = {
    common: require('../Chunks/common.glsl'),
    uv_pars_vertex: require('../Chunks/uv_pars_vertex.glsl'),
    uv2_pars_vertex: require('../Chunks/uv2_pars_vertex.glsl'),
    envmap_pars_vertex: require('../Chunks/envmap_pars_vertex.glsl'),
    color_pars_vertex: require('../Chunks/color_pars_vertex.glsl'),
    fog_pars_vertex: require('../Chunks/fog_pars_vertex.glsl'),
    morphtarget_pars_vertex: require('../Chunks/morphtarget_pars_vertex.glsl'),
    skinning_pars_vertex: require('../Chunks/skinning_pars_vertex.glsl'),
    logdepthbuf_pars_vertex: require('../Chunks/logdepthbuf_pars_vertex.glsl'),
    clipping_planes_pars_vertex: require('../Chunks/clipping_planes_pars_vertex.glsl'),
    uv_vertex: require('../Chunks/uv_vertex.glsl'),
    uv2_vertex: require('../Chunks/uv2_vertex.glsl'),
    color_vertex: require('../Chunks/color_vertex.glsl'),
    skinbase_vertex: require('../Chunks/skinbase_vertex.glsl'),
    beginnormal_vertex: require('../Chunks/beginnormal_vertex.glsl'),
    morphnormal_vertex: require('../Chunks/morphnormal_vertex.glsl'),
    skinnormal_vertex: require('../Chunks/skinnormal_vertex.glsl'),
    defaultnormal_vertex: require('../Chunks/defaultnormal_vertex.glsl'),
    begin_vertex: require('../Chunks/begin_vertex.glsl'),
    morphtarget_vertex: require('../Chunks/morphtarget_vertex.glsl'),
    skinning_vertex: require('../Chunks/skinning_vertex.glsl'),
    project_vertex: require('../Chunks/project_vertex.glsl'),
    logdepthbuf_vertex: require('../Chunks/logdepthbuf_vertex.glsl'),
    worldpos_vertex: require('../Chunks/worldpos_vertex.glsl'),
    clipping_planes_vertex: require('../Chunks/clipping_planes_vertex.glsl'),
    envmap_vertex: require('../Chunks/envmap_vertex.glsl'),
    fog_vertex: require('../Chunks/fog_vertex.glsl'),
    color_pars_fragment: require('../Chunks/color_pars_fragment.glsl'),
    uv_pars_fragment: require('../Chunks/uv_pars_fragment.glsl'),
    uv2_pars_fragment: require('../Chunks/uv2_pars_fragment.glsl'),
    map_pars_fragment: require('../Chunks/map_pars_fragment.glsl'),
    alphamap_pars_fragment: require('../Chunks/alphamap_pars_fragment.glsl'),
    aomap_pars_fragment: require('../Chunks/aomap_pars_fragment.glsl'),
    lightmap_pars_fragment: require('../Chunks/lightmap_pars_fragment.glsl'),
    envmap_pars_fragment: require('../Chunks/envmap_pars_fragment.glsl'),
    fog_pars_fragment: require('../Chunks/fog_pars_fragment.glsl'),
    specularmap_pars_fragment: require('../Chunks/specularmap_pars_fragment.glsl'),
    logdepthbuf_pars_fragment: require('../Chunks/logdepthbuf_pars_fragment.glsl'),
    clipping_planes_pars_fragment: require('../Chunks/clipping_planes_pars_fragment.glsl'),
    clipping_planes_fragment: require('../Chunks/clipping_planes_fragment.glsl'),
    logdepthbuf_fragment: require('../Chunks/logdepthbuf_fragment.glsl'),
    map_fragment: require('../Chunks/map_fragment.glsl'),
    color_fragment: require('../Chunks/color_fragment.glsl'),
    alphamap_fragment: require('../Chunks/alphamap_fragment.glsl'),
    alphatest_fragment: require('../Chunks/alphatest_fragment.glsl'),
    specularmap_fragment: require('../Chunks/specularmap_fragment.glsl'),
    aomap_fragment: require('../Chunks/aomap_fragment.glsl'),
    envmap_fragment: require('../Chunks/envmap_fragment.glsl'),
    premultiplied_alpha_fragment: require('../Chunks/premultiplied_alpha_fragment.glsl'),
    tonemapping_fragment: require('../Chunks/tonemapping_fragment.glsl'),
    encodings_fragment: require('../Chunks/encodings_fragment.glsl'),
    fog_fragment: require('../Chunks/fog_fragment.glsl')
}

export default class BasicMaterial extends THREE.ShaderMaterial {
    constructor(parameters) {
        //declare parameters for this material
        const defaultParameters = {
            color: new THREE.Color(0xffffff),
            map: null,
            lightMap: null,
            lightMapIntensity: 1.0,
            aoMap: null,
            aoMapIntensity: 1.0,
            specularMap: null,
            alphaMap: null,
            envMap: null,
            combine: THREE.MultiplyOperation,
            reflectivity: 1,
            refractionRatio: 0.98
        }

        const uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.specularmap,
            THREE.UniformsLib.envmap,
            THREE.UniformsLib.aomap,
            THREE.UniformsLib.lightmap,
            THREE.UniformsLib.fog
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
