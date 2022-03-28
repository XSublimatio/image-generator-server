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
      path: '/api/metadata/1234',
    });
    t.match(response.statusCode, 200);
    t.match(response.json(), {
      attributes: [
        { trait_type: 'Category', value: 'molecule' },
        { trait_type: 'Name', value: 'Water' },
        { trait_type: 'Seed', display_type: 'number', value: 1234 },
        { trait_type: 'Type', display_type: 'number', value: 0 },
        { trait_type: 'Formula', value: 'H2_O' },
      ],
      description: `An xSublimatio molecule`,
      name: 'Water',
      background_color: 'ffffff',
      image: 'https://localhost:5552/media/1234.webp',
      animation_url: 'https://localhost:5552/media/1234.mp4',
    });
  });
});
