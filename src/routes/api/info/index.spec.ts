import { FastifyInstance } from 'fastify';
import { createServer } from '../../../index';
import tap from 'tap';

let server: FastifyInstance;
tap.test('GET /api/info', (t) => {
  t.before(async () => {
    server = await createServer();
  });
  t.teardown(async () => {
    await server.close();
  });
  t.plan(1);
  t.test('Should return contract metadata', async (t) => {
    const response = await server.inject({
      method: 'GET',
      path: '/api/info',
    });
    t.match(response.statusCode, 200);
    t.match(response.json(), {
      name: 'xSublimatio',
      description: `Lorem Ipsum`,
      image: 'https://localhost:5552/media/xSublimatio.png',
      external_link: 'faction.art/xsublimatio',
      seller_fee_basis_points: 0,
      fee_recipient: '',
    });
  });
});
