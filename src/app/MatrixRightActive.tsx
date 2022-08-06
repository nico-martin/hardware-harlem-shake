import React from 'react';
import UsbMatrix from '@common/usb/UsbMatrix';
import cn from '@common/utils/classnames';
import { useHarlemShake } from '../HarlemShakeContext';

const MatrixRightActive = ({
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

  const intensity = React.useMemo(() => (beat >= 5 ? 200 : 30), [beat]);

  React.useEffect(() => {
    if (
      fullMatrix &&
      JSON.stringify(fullMatrixRef.current) !== JSON.stringify(fullMatrix)
    ) {
      fullMatrixRef.current = fullMatrix;
      const matrix = [...fullMatrix].splice(16, 33);
      Matrix.setGridMatrixFromAudioArray(matrix, intensity);
      usbSend(Matrix.getDataview());
    }
  }, [fullMatrix]);

  return <div className={cn(className)}>{name}</div>;
};

export default MatrixRightActive;
