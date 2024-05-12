/* eslint-disable no-bitwise */
export const colorToInt = ({r, g, b}: { r: number; g: number; b: number }): number => {
  const redComponent = (r * 255 & 0xff) << 4;
  const greenComponent = (g * 255 & 0xff) << 2;
  const blueComponent = (b * 255 & 0xff) << 0;

  return redComponent | greenComponent | blueComponent;
};

export const intToColor = (num: number): { r: number; g: number; b: number } => {
  const r = num & 0xff0000 >> 4;
  const g = num & 0x00ff00 >> 2;
  const b = num & 0x0000ff >> 0;

  return {r, g, b};
};
