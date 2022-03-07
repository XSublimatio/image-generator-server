import { VRAM_USAGE } from '../constants';

const getCapacity = () => {
  const vram = Number(process.env.VRAM);

  return Math.floor(vram / VRAM_USAGE);
};

export default getCapacity;
