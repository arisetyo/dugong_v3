/**
 * @file server.js
 * @version 0.0.1
 * @copyright Arie M. Prasetyo
 * @description A Fastify server with SSR and API endpoints
 */

import Fastify from 'fastify'
import FastifyView from '@fastify/view'
import FastifyStatic from '@fastify/static'

import * as sass from 'sass'
import ejs from 'ejs'

import dotenv from 'dotenv'
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))

const SERVICE_PORT_NUMBER = 3330
const VIEWS_DIR = 'views'


// Create the server = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const server = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
})

// Register plugins
server.register(FastifyView, {
  engine: { ejs }
})
server.register(FastifyStatic, {
  root: join(__dirname, 'public'),
  prefix: '/'
})


// Compile Sass to CSS = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const compileSass = async () =>{
  const result = await sass.compileAsync(join(__dirname, 'views/styles/MAIN.scss'))
  fs.writeFileSync(join(__dirname, 'public/assets/styles.css'), result.css)
}
compileSass()


// Endpoints = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SSR Pages
server.get('/', async (_, reply) => {
  return reply.view(`${VIEWS_DIR}/pages/index.ejs`)
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// API's
// TBA


// Start the server = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const start = async () => {
  try {
    await server.listen({ port: SERVICE_PORT_NUMBER })
    console.log(`Server listening on port ${SERVICE_PORT_NUMBER}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()