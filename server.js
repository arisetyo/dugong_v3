import Fastify from 'fastify'
import FastifyView from '@fastify/view'

import ejs from 'ejs'

const SERVICE_PORT_NUMBER = 3330
const VIEWS_DIR = 'views';

const server = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
})

server.register(FastifyView, {
  engine: { ejs }
})

// Endpoints = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
server.get('/', async (_, reply) => {
  return reply.view(`${VIEWS_DIR}/index.ejs`)
})

server.get('/api/clicked', async (_, reply) => {
  reply.type('text/html').send('<h2>Clicked</h2>')
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