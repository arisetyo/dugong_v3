import Fastify from 'fastify'
import FastifyView from '@fastify/view'
import FastifyStatic from '@fastify/static'

import * as sass from 'sass'
import ejs from 'ejs'

import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SERVICE_PORT_NUMBER = 3330
const VIEWS_DIR = 'views';

// Create the server
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


// Compile Sass to CSS
const compileSass = async () =>{
  const result = await sass.compileAsync(join(__dirname, 'views/styles/main.scss'))
  fs.writeFileSync(join(__dirname, 'public/styles.css'), result.css)
}

// compile sass 
compileSass()

// Endpoints = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SSR Pages

server.get('/', async (_, reply) => {
  return reply.view(`${VIEWS_DIR}/pages/index.ejs`)
})

server.get('/about', async (_, reply) => {
  return reply.view(`${VIEWS_DIR}/pages/about.ejs`)
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// API's

server.get('/api/greet', async (_, reply) => {
  reply.type('text/html').send('<h2>Hello from <strong>Fastify</strong></h2>')
})

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

// Start the server
start()