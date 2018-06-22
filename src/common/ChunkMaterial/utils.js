import defaultChunks from './chunks'

//modified version of parseIncludes from WebGLRenderer, this one considers outside chunks
export function parseIncludes(string, optionalChunks = {}) {
    var pattern = /^[ \t]*#include +<([\w\d.]+)>/gm

    function replace(match, include) {
        var replace = optionalChunks[include] || defaultChunks[include]

        if (replace === undefined) {
            throw new Error('Can not resolve #include <' + include + '>')
        }

        return parseIncludes(replace)
    }

    return string.replace(pattern, replace)
}

//some parameters have different uniform names
const SPECIAL_UNIFORM_MAPPING = {
    color: 'diffuse'
}

//TODO: live on ChunkMaterial
//initializes default parameters and hooks up uniforms
export function initParameters(
    material,
    defaultParameters,
    optionalParameters = {}
) {
    Object.keys(defaultParameters).forEach(paramName => {
        //some parameters have different uniform names
        const uniformName = material.uniforms[
            SPECIAL_UNIFORM_MAPPING[paramName]
        ]
            ? SPECIAL_UNIFORM_MAPPING[paramName]
            : paramName

        //if there is a uniform
        if (material.uniforms[uniformName]) {
            Object.defineProperty(material, paramName, {
                get: () => material.uniforms[uniformName].value,
                set: value => (material.uniforms[uniformName].value = value)
            })
            console.log('uniform', paramName)
        } else {
            console.log('no uniform', paramName)
            //TODO: figure out what to do with these, probably shouldnt be on material
            //      or lookup some mapping and modify the uniform (param)
        }

        //wire input parameters, consider types and map appropriately
        //
        material[paramName] = defaultParameters[paramName]

        const currentValue = material[paramName]
        const optionalParam = optionalParameters[paramName]

        if (currentValue && currentValue.isColor && optionalParam) {
            currentValue.set(optionalParam)
        } else if (
            currentValue &&
            currentValue.isVector3 &&
            (optionalParam && optionalParam.isVector3)
        ) {
            currentValue.copy(optionalParam)
        } else if (optionalParam !== undefined) {
            material[paramName] = optionalParam
        }
    })
}
