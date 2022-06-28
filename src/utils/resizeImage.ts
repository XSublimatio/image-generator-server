import sharp from 'sharp';

function resizeImage(buffer: Buffer, resolution: { width: number; height: number }) {
  return sharp(buffer).resize(resolution.width, resolution.height).webp({}).toBuffer();
}

export default resizeImage;
