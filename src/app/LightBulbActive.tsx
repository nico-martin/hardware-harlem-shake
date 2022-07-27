import React from 'react';
import cn from '@common/utils/classnames';
import { getRandomColor } from '@common/utils/helpers';
import { useHarlemShake } from '../HarlemShakeContext';
import useBLECharacteristic from './hooks/useBLECharacteristic';

const red = new Uint8Array([0, 255, 0, 0]);
const green = new Uint8Array([0, 0, 255, 0]);

const LightBulbActive = ({
  className = '',
  batteryChar,
  lightChar,
}: {
  className?: string;
  batteryChar: BluetoothRemoteGATTCharacteristic;
  lightChar: BluetoothRemoteGATTCharacteristic;
}) => {
  const batteryLevelChar = useBLECharacteristic(batteryChar);
  const lightLightChar = useBLECharacteristic(lightChar);

  const { beat, beatPulse, isHalfBeat } = useHarlemShake();

  React.useEffect(() => {
    const c = getRandomColor();
    lightLightChar.writeValue(
      beat >= 5
        ? new Uint8Array([0, c.r, c.g, c.b])
        : new Uint8Array([0, 0, 0, 0])
    );
  }, [isHalfBeat]);

  return (
    <div className={cn(className)}>
      LightBulb
      <br />
      Battery {batteryLevelChar.value?.getUint8(0)}%
    </div>
  );
};

export default LightBulbActive;
