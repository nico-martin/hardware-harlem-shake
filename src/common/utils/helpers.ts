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

const colorMap = (): Array<[number, number, number]> => {
  /**
   * farbrad ist in 6 Teile aufgeteilt
   * - R 255, G asc, B 0 => 0 - 255
   * - R des, G 255, B 0 => 256 - 511
   * - R 0, G 255, B asc => 512 - 767
   * - R 0, G des, B 255 => 768 - 1023
   * - R asc, G 0, B 255 => 1024 - 1279
   * - R 255, G 0, B des => 1278 - 1534
   */

  return Array(1530)
    .fill('')
    .map((e, i) => i)
    .map((number) => {
      if (number <= 255) {
        // R 255, G asc, B 0 => 0 - 255
        return [255, number, 0];
      } else if (number <= 255 * 2) {
        // R des, G 255, B 0 => 256 - 511
        return [255 - (number - 255), 255, 0];
      } else if (number <= 255 * 3) {
        // R 0, G 255, B asc => 512 - 767
        return [0, 255, number - 255 * 2];
      } else if (number <= 255 * 4) {
        // R 0, G des, B 255 => 768 - 1023
        return [0, 255 * 4 - number, 255];
      } else if (number <= 255 * 5) {
        // R asc, G 0, B 255 => 1024 - 1279
        return [number - 255 * 4, 0, 255];
      } else if (number <= 255 * 6) {
        // R 255, G 0, B des => 1278 - 1534
        return [255, 0, 255 * 6 - number];
      }
    });
};

export const generateRainbowColors = (
  partNumber: number = 6
): Array<RgbColorI> => {
  const allColors = colorMap();
  const partsLength = Math.round(allColors.length / partNumber);
  const parts = Array(partNumber)
    .fill('')
    .map((e, i) => i * partsLength);

  return parts.map((colorNumber) => {
    const [r, g, b] = allColors[colorNumber];
    return { r, g, b };
  });
};
