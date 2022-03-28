import tap from 'tap';
import fs from 'fs';
import loadConfig from './config';
import { uploadFile } from './uploadFile';

tap.test('S3 Upload', async (t) => {
  const filePath = './.temp/test';

  fs.closeSync(fs.openSync(filePath, 'w'));

  try {
    await uploadFile(filePath);
  } catch (e) {
    console.error(e);
    t.fail(e);
  }

  t.end();
});
