import React from 'react';
import { Loader, MESSAGE_TYPES } from '@theme';
import { getRandomColor } from '@common/utils/helpers';
import { useHarlemShake } from '../HarlemShakeContext';
import LightBulbActive from './LightBulbActive';
import useBLEDevice, { DEVICE_STATE } from './hooks/useBLEDevice';
import { useToast } from './toast/toastContext';

const BLE_UUID = {
  SERVICE_LIGHT: 0xff0f,
  CHAR_LIGHT: 0xfffc,
  SERVICE_BATTERY: 0x180f,
  CHAR_BATTERY_LEVEL: 0x2a19,
};

const LightBulb = ({
  className = '',
  classNameActive = '',
  setConnectedDevices,
}: {
  className?: string;
  classNameActive?: string;
  setConnectedDevices: (number) => void;
}) => {
  const { addToast } = useToast();

  const bleDevics = useBLEDevice({
    filters: [{ name: 'PLAYBULB sphere' }],
    chars: {
      light: {
        UUID: BLE_UUID.SERVICE_LIGHT,
        characteristics: {
          light: BLE_UUID.CHAR_LIGHT,
        },
      },
      battery: {
        UUID: BLE_UUID.SERVICE_BATTERY,
        characteristics: {
          level: BLE_UUID.CHAR_BATTERY_LEVEL,
        },
      },
    },
    onConnected: () => setConnectedDevices((devices) => devices + 1),
    onDisconnected: () => setConnectedDevices((devices) => devices - 1),
  });

  React.useEffect(() => {
    Boolean(bleDevics.error) &&
      bleDevics.state === DEVICE_STATE.ERROR &&
      addToast({ message: bleDevics.error, type: MESSAGE_TYPES.ERROR });
  }, [bleDevics.error, bleDevics.state]);

  return bleDevics.state === DEVICE_STATE.SUCCESS ? (
    <LightBulbActive
      batteryChar={bleDevics.characteristics.battery.level}
      lightChar={bleDevics.characteristics.light.light}
      className={className + ' ' + classNameActive}
    />
  ) : (
    <button
      disabled={bleDevics.state === DEVICE_STATE.LOADING}
      onClick={() => bleDevics.connect()}
      className={className}
    >
      {bleDevics.state === DEVICE_STATE.LOADING ? (
        <Loader large centered />
      ) : (
        'LightBulb'
      )}
    </button>
  );
};

export default LightBulb;
