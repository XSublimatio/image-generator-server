import tap from 'tap';
import fs from 'fs';
import { uploadFile } from './uploadFile';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.API_SECRET;

tap.test('S3 Upload', async (t) => {
  const filePath = './.temp/test';

  fs.closeSync(fs.openSync(filePath, 'w'));

  try {
    await uploadFile(filePath, '123', 'image');
  } catch (e) {
    console.error(e);
    t.fail(e);
  }

  t.end();
});
