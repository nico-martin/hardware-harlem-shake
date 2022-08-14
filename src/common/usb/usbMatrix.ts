import {
  arrayFlat,
  generateRainbowColors,
  RgbColorI,
} from '@common/utils/helpers';

type rgbT = [r: number, g: number, b: number];

const array = (length: number): null[] =>
  new Array(length).fill('').map(() => null);

const getGridMatrix = (
  [r, g, b]: rgbT = [0, 0, 0],
  size: number = 16
): rgbT[][] => array(size).map(() => array(size).map(() => [r, g, b]));

class UsbMatrix {
  private gridMatrix: rgbT[][] = getGridMatrix([0, 0, 0], 0);
  private readonly matrixSize: number = 0;

  constructor(size: number = 16) {
    this.matrixSize = size;
    this.gridMatrix = getGridMatrix([0, 0, 0], size);
  }

  setGridMatrixFromAudioArray(
    audio: Array<number>,
    intensity: number = 200,
    colorsPerCol: Array<RgbColorI>
  ) {
    const colorsPerRow = generateRainbowColors(16);
    this.gridMatrix = this.gridMatrix.map((cols, rowIndex, allRows) =>
      cols.map((pixel, colIndex) => {
        const audioHeight = audio[colIndex];
        if (!audioHeight) {
          return [0, 0, 0];
        }

        const reversedRowIndex = allRows.length - 1 - rowIndex;
        const int = reversedRowIndex < audioHeight ? intensity : 0;
        if (int === 255) {
          const { r, g, b } = colorsPerRow[rowIndex];
          //const { r, g, b } = colorsPerCol[colIndex];
          return [r, g, b];
        }
        return [int, int, int];
      })
    );
  }

  getDataview(): BufferSource {
    return new Uint8Array(this.gridMatrixToNeopixelArray(this.gridMatrix));
  }

  gridMatrixToNeopixelArray(gridMatrix: rgbT[][]): number[] {
    const size = gridMatrix.length;
    const ledMatrix: rgbT[][] = getGridMatrix();
    gridMatrix.map((col, rowIndex) =>
      col.map((pixel, colIndex) => {
        ledMatrix[rowIndex][
          rowIndex % 2 !== 1 ? size - colIndex - 1 : colIndex
        ] = pixel;
      })
    );

    return arrayFlat<number>(arrayFlat<rgbT>(ledMatrix));
  }

  setGridMatrixFromArray(array: rgbT[][]) {
    this.gridMatrix = this.gridMatrix.map((cols, rowIndex) =>
      cols.map((pixel, colIndex) => [
        array[rowIndex][colIndex][0],
        array[rowIndex][colIndex][1],
        array[rowIndex][colIndex][2],
      ])
    );
  }
}

export default UsbMatrix;
