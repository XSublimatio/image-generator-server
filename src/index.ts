import path from 'path';

import fastify from 'fastify';
import now from 'fastify-now';
import startCore from './core';

// Load env vars
import loadConfig from './lib/config';
loadConfig();

export async function createServer() {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });

  server.register(now, {
    routesFolder: path.join(__dirname, './routes'),
  });

  await server.ready();
  return server;
}

export async function startServer() {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const server = await createServer();
  await server.listen(+process.env.API_PORT, process.env.API_HOST);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
}

if (process.env.NODE_ENV !== 'test') {
  if (!process.env.DISABLE_IMAGE_GENERATION) {
    startCore();
  }
  startServer();
}
