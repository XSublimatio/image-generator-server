import { FastifyInstance } from 'fastify';
import { createServer } from '../../index';
import tap from 'tap';
import { destroyPrismaTest, startPrismaTest } from '../../lib/prisma';

let server: FastifyInstance;
tap.test('POST /api/new-image', (t) => {
  t.before(async () => {
    await startPrismaTest();
    server = await createServer();
  });
  t.teardown(async () => {
    await destroyPrismaTest();
    await server.close();
  });
  t.plan(1);
  t.test('Should return 2', async (t) => {
    const response = await server.inject({
      method: 'POST',
      path: '/api/new-image',
      payload: {
        tokenId: '123',
      },
    });
    t.match(response.statusCode, 202);
    t.match(response.json(), { success: true });
  });
});
