import React from 'react';
import UsbMatrix from '@common/usb/UsbMatrix';
import cn from '@common/utils/classnames';
import { generateRainbowColors } from '@common/utils/helpers';
import { useHarlemShake } from '../HarlemShakeContext';

const colors = generateRainbowColors(32);

const MatrixLeftActive = ({
  className = '',
  name,
  usbSend,
}: {
  className?: string;
  name: string;
  usbSend: (data: BufferSource) => void;
}) => {
  const { matrix: fullMatrix, beat } = useHarlemShake();
  const fullMatrixRef = React.useRef<Array<number>>(null);
  const Matrix = React.useMemo<UsbMatrix>(() => new UsbMatrix(), []);
  const intensity = React.useMemo(() => (beat >= 5 ? 255 : 30), [beat]);

  React.useEffect(() => {
    if (
      fullMatrix &&
      JSON.stringify(fullMatrixRef.current) !== JSON.stringify(fullMatrix)
    ) {
      fullMatrixRef.current = fullMatrix;
      const matrix = [...fullMatrix].splice(0, 16);
      Matrix.setGridMatrixFromAudioArray(
        matrix,
        intensity,
        [...colors].splice(0, 16)
      );
      usbSend(Matrix.getDataview());
    }
  }, [fullMatrix]);

  return <div className={cn(className)}>{name}</div>;
};

export default MatrixLeftActive;
