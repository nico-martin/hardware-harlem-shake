export const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export interface RgbColorI {
  r: number;
  g: number;
  b: number;
}

const byteToHex = (c: number): string => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

const heyToByte = (hex: string) => {};

export const rgbToHex = (r: number, g: number, b: number): string =>
  '#' + byteToHex(r) + byteToHex(g) + byteToHex(b);

export const hexToRgb = (hex: string): RgbColorI => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getRandomColor = (): RgbColorI => {
  const letters = '0123456789ABCDEF';
  return hexToRgb(
    '#' +
      new Array(6)
        .fill('')
        .map(() => letters[Math.floor(Math.random() * 16)])
        .join('')
  );
};

export const arrayFlat = <T = any>(array: T[][]): T[] =>
  array.reduce((acc, current) => [...acc, ...current], []);
