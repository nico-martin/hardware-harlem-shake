import React from 'react';
import cn from '@common/utils/classnames';
import { getRandomColor } from '@common/utils/helpers';
import { MATRIX, matrixToArray } from '@common/utils/matrix';
import { useHarlemShake } from '../HarlemShakeContext';
import useBLECharacteristic from './hooks/useBLECharacteristic';

const CarActive = ({
  className = '',
  ledChar,
  motorChar,
}: {
  className?: string;
  ledChar: BluetoothRemoteGATTCharacteristic;
  motorChar: BluetoothRemoteGATTCharacteristic;
}) => {
  const ledStateChar = useBLECharacteristic(ledChar);
  const motorWheelsChar = useBLECharacteristic(motorChar);
  const { beat, beatPulse, isHalfBeat } = useHarlemShake();

  const maybeSetMotor = (newValue) =>
    newValue !== motorWheelsChar.value && motorWheelsChar.writeValue(newValue);

  React.useEffect(() => {
    console.log(motorWheelsChar.value);
  }, [motorWheelsChar.value]);

  React.useEffect(() => {
    beat >= 5
      ? //? maybeSetMotor(new Uint8Array(beat % 2 == 0 ? [0, 200] : [200, 0]))
        maybeSetMotor(new Uint8Array([130, 70]))
      : maybeSetMotor(new Uint8Array([100, 100]));
    ledStateChar.writeValue(
      new Uint8Array(
        beat >= 5 ? new Uint8Array([2]) : new Uint8Array([isHalfBeat ? 5 : 6])
      )
    );
  }, [isHalfBeat]);

  return <div className={cn(className)}>Car</div>;
};

export default CarActive;
