const Koa = require('koa')

const serve = require('koa-static')
const compress = require('koa-compress')

const server = new Koa()

server.use(serve('static'))

const NODE_ENV = process.env.NODE_ENV || 'development'
global.__DEV__ = NODE_ENV !== 'production'
global.__PROD__ = NODE_ENV === 'production'

if (__DEV__) {
    const webpack = require('./webpack.server')
    webpack(server)
} else {
    server.use(compress())
    server.use(serve('build'))
}

server.listen(3344, () => {
    console.info('Server is running at 3344!')
})
