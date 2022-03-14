import { FastifyInstance } from 'fastify';
import { createServer } from '../../../index';
import tap from 'tap';

let server: FastifyInstance;
tap.test('GET /api/metadata', (t) => {
  t.before(async () => {
    server = await createServer();
  });
  t.teardown(async () => {
    await server.close();
  });
  t.plan(1);
  t.test('Should return metadata', async (t) => {
    const response = await server.inject({
      method: 'GET',
      path: '/api/metadata/879278525543653493923200939433435425722167946518547744507993911317960893',
    });
    t.match(response.statusCode, 200);
    t.match(response.json(), {
      attributes: [
        { trait_type: 'Category', value: 'molecule' },
        { trait_type: 'Name', value: 'Name' },
        { trait_type: 'Seed', value: '11111' },
        { trait_type: 'type', value: '1' },
      ],
      description: `An xSublimatio molecule`,
      name: 'https://localhost:5552/media/879278525543653493923200939433435425722167946518547744507993911317960893.jpeg',
      background_color: 'ffffff',
      image:
        'https://localhost:5552/media/879278525543653493923200939433435425722167946518547744507993911317960893.mp4',
      animation_url: '',
    });
  });
});
