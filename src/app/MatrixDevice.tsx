import React from 'react';
import { Loader, MESSAGE_TYPES } from '@theme';
import MatrixLeftActive from './MatrixLeftActive';
import MatrixRightActive from './MatrixRightActive';
import useBLEDevice, { DEVICE_STATE } from './hooks/useBLEDevice';
import { useToast } from './toast/toastContext';

const BLE_UUID = {
  SERVICE_BATTERY: 0x180f,
  CHAR_BATTERY_LEVEL: 0x2a19,
  CHAR_BATTERY_LOADING: '17324f48-a9c3-487a-83ff-e6046cf48b51',
  SERVICE_MATRIX: '9f66b797-148b-4f7a-9f59-a5b0ee38923e',
  CHAR_MATRIX: 'ef36dea4-9310-4b69-bcf3-c17fef1ee84c',
};

const MatrixDevice = ({
  className = '',
  classNameActive = '',
  setConnectedDevices,
  side = 'left',
}: {
  className?: string;
  classNameActive?: string;
  setConnectedDevices: (number) => void;
  side: 'left' | 'right';
}) => {
  const { addToast } = useToast();
  const bleDevics = useBLEDevice({
    filters: [{ namePrefix: 'Scroll Hat Matrix' }],
    chars: {
      matrix: {
        UUID: BLE_UUID.SERVICE_MATRIX,
        characteristics: {
          leds: BLE_UUID.CHAR_MATRIX,
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
    side === 'right' ? (
      <MatrixRightActive
        batteryChar={bleDevics.characteristics.battery.level}
        matrixChar={bleDevics.characteristics.matrix.leds}
        className={className + ' ' + classNameActive}
        name={bleDevics.device.name}
      />
    ) : (
      <MatrixLeftActive
        batteryChar={bleDevics.characteristics.battery.level}
        matrixChar={bleDevics.characteristics.matrix.leds}
        className={className + ' ' + classNameActive}
        name={bleDevics.device.name}
      />
    )
  ) : (
    <button
      disabled={bleDevics.state === DEVICE_STATE.LOADING}
      onClick={() => bleDevics.connect()}
      className={className}
    >
      {bleDevics.state === DEVICE_STATE.LOADING ? (
        <Loader large centered />
      ) : (
        'LEDMatrix'
      )}
    </button>
  );
};

export default MatrixDevice;
