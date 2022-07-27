import React from 'react';
import cn from '@common/utils/classnames';
import { setMatrixValue } from '@common/utils/matrix';
import { useHarlemShake } from '../HarlemShakeContext';
import useBLECharacteristic from './hooks/useBLECharacteristic';
import useScreen from './hooks/useScreen';

const MatrixLeftActive = ({
  className = '',
  batteryChar,
  matrixChar,
  name,
}: {
  className?: string;
  batteryChar: BluetoothRemoteGATTCharacteristic;
  matrixChar: BluetoothRemoteGATTCharacteristic;
  name: string;
}) => {
  const batteryLevelChar = useBLECharacteristic(batteryChar);
  const [screen, setScreen] = useScreen(matrixChar);
  const { matrix: fullMatrix, beat } = useHarlemShake();
  const fullMatrixRef = React.useRef<Array<number>>(null);

  const intensity = React.useMemo(() => (beat >= 5 ? 200 : 30), [beat]);

  React.useEffect(() => {
    if (
      fullMatrix &&
      JSON.stringify(fullMatrixRef.current) !== JSON.stringify(fullMatrix)
    ) {
      fullMatrixRef.current = fullMatrix;
      const matrix = [...fullMatrix].splice(0, 17);
      setScreen(
        Array(7)
          .fill(0)
          .map((e, i) => matrix.map((v) => (7 - i <= v ? intensity : 0)))
      );
    }
  }, [fullMatrix]);

  return (
    <div className={cn(className)}>
      {name}
      <br />
      Battery {batteryLevelChar.value?.getUint8(0)}%
    </div>
  );
};

export default MatrixLeftActive;
