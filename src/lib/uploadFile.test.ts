import tap from 'tap';
import fs, { readFileSync } from 'fs';
import { uploadFile } from './uploadFile';

tap.test('S3 Upload', async (t) => {
  const filePath = './.temp/test';

  fs.closeSync(fs.openSync(filePath, 'w'));

  try {
    const buffer = readFileSync(filePath);

    await uploadFile({
      resolution: { width: 0, height: 0 },
      tokenId: '0',
      mediaType: 'video',
      buffer,
    });
  } catch (e) {
    console.error(e);
    t.fail(e);
  }

  t.end();
});
