# Three.js Webpack ES6 boilerplate

## Overview

### [WIP]

First stab at a lean-ish *"let's write three.js code like it's 2017"* boilerplate. Doesn't care what you do with three.js, just allows you to import it and write es6. What it should solve in the first pass:

- run through Webpack
- provide ES6 via Babel
- lint 
- import GLSL *(write a `.glsl|.vert|.vs|.frag|.fs` file and import it into your javascript)*
- transform `require('./myTexture.png')` or `require('assets/textures/myCommonTex.png')` into something like `/assets/myTexture-2c3ad56f81.png`
- sass should work 

## Install

Clone the repo:
`git clone https://github.com/paulmg/ThreeJS-Webpack-ES6-Boilerplate.git`
Run: 
`npm install` or `yarn`

## Develop

`yarn dev` should spin up a Koa server with webpack middleware. HMR doesn't do much for three here, but could refresh GLSL. The page should refresh when changing any `.js` files. Go to http://localhost:3344 to see results. 


## Build

There is a script in `package.json` called `build`. It will run webpack with `production` flag and save the output in `/build`. You can run it with `yarn build`. `yarn start` will spin up a Koa server with the bundled files.

## TODO

- don't like what HTMLWebpackPlugin does with lodash, needs investigation
- hot updating GLSL would be great
- instructions on how to setup sublime to lint the files
- some example three.js code
- use only needed three components rather than the whole library
- more


