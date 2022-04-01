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
      path: '/api/metadata/9500336667313372540169390661494672859605720546372424896104851258867200347492',
    });
    t.match(response.statusCode, 200);
    t.match(response.json(), {
      attributes: [
        { trait_type: 'Category', value: 'molecule' },
        { trait_type: 'Name', value: 'Lactuside A' },
        { trait_type: 'Hue', display_type: 'number', value: 37084 },
        { trait_type: 'Saturation', display_type: 'number', value: 57784 },
        { trait_type: 'Brightness', display_type: 'number', value: 22805 },
        { trait_type: 'Seed', display_type: 'number', value: 1879100772 },
        { trait_type: 'Deformation', value: 'None' },
        { trait_type: 'Stripes Color Shift', value: 'On' },
        { trait_type: 'Stripes Amount', value: 'High' },
        { trait_type: 'Blob', value: 'Square' },
        { trait_type: 'Palette', value: 'Monochrome' },
        { trait_type: 'Molecule Lighting', value: 'Mixed' },
        { trait_type: 'Molecule Integrity', value: 'High' },
      ],
      description: `An xSublimatio molecule`,
      name: 'Lactuside A',
      background_color: 'ffffff',
      image:
        'https://localhost:5552/media/9500336667313372540169390661494672859605720546372424896104851258867200347492.png',
      animation_url:
        'https://localhost:5552/media/9500336667313372540169390661494672859605720546372424896104851258867200347492.webm',
    });
  });
});
