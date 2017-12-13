const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const config = require('./webpack.config')
const compiler = webpack(config)

// Based on: https://github.com/dayAlone/koa-webpack-hot-middleware/blob/master/index.js
function applyExpressMiddleware(fn, req, res) {
    const originalEnd = res.end

    return new Promise(resolve => {
        res.end = function(...args) {
            originalEnd.apply(this, args)
            resolve(false)
        }
        fn(req, res, () => {
            resolve(true)
        })
    })
}

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
})

module.exports = app => {
    app.use(async (ctx, next) => {
        let hasNext = await applyExpressMiddleware(devMiddleware, ctx.req, {
            end(content) {
                ctx.body = content
            },
            setHeader(...args) {
                ctx.set(...args)
            }
        })

        if (hasNext) {
            await next()
        }
    })

    app.use(async (ctx, next) => {
        let hasNext = await applyExpressMiddleware(
            webpackHotMiddleware(compiler),
            ctx.req,
            ctx.res
        )

        if (hasNext) {
            await next()
        }
    })
}
