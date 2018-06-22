export function parseIncludes(string, chunks) {
    var pattern = /^[ \t]*#include +<([\w\d.]+)>/gm

    function replace(match, include) {
        var replace = chunks[include]

        if (replace === undefined) {
            throw new Error('Can not resolve #include <' + include + '>')
        }

        return parseIncludes(replace)
    }

    return string.replace(pattern, replace)
}

const specialUniformMapping = {
    color: 'diffuse'
}

export function initParameters(
    material,
    defaultParameters,
    optionalParameters = {}
) {
    Object.keys(defaultParameters).forEach(paramName => {
        const uniformName = material.uniforms[specialUniformMapping[paramName]]
            ? specialUniformMapping[paramName]
            : paramName

        if (material.uniforms[uniformName]) {
            Object.defineProperty(material, paramName, {
                get: () => material.uniforms[uniformName].value,
                set: value => (material.uniforms[uniformName].value = value)
            })
            console.log('uniform', paramName)
        } else console.log('no uniform', paramName)

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
