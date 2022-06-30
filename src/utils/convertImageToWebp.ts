import sharp from 'sharp';

function convertImageToWebp(buffer: Buffer) {
  return sharp(buffer).webp({}).toBuffer();
}

export default convertImageToWebp;
