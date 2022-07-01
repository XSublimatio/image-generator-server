import sharp from 'sharp';

function convertImageToWebp(buffer: Buffer) {
  return sharp(buffer).webp({ lossless: true }).toBuffer();
}

export default convertImageToWebp;
