import React from 'react';
import { Loader, MESSAGE_TYPES } from '@theme';
import CarActive from './CarActive';
import useBLEDevice, { DEVICE_STATE } from './hooks/useBLEDevice';
import { useToast } from './toast/toastContext';

const BLE_UUID = {
  SERVICE_MOTOR: 'c10e3e56-fdd3-11eb-9a03-0242ac130003',
  CHAR_MOTOR: '35a1022c-fdd3-11eb-9a03-0242ac130003',
  //SERVICE_DEVICE: 0x180a,
  //CHAR_MANUFACRURER: 0x2a29,
  //CHAR_SOFTWARE_REVISION: 0x2a28,
  //CHAR_MODEL_NUMBER: 0x2a24,
  //SERVICE_BATTERY: 0x180f,
  //CHAR_BATTERY: 0x2a19,
  //CHAR_BATTERY_LOADING: '17324f48-a9c3-487a-83ff-e6046cf48b51',
  SERVICE_LED: '90c554cb-1640-44d6-88ee-85a5eb8ace90',
  CHAR_LED: 'f601d5ac-c20b-4917-9cfc-28788d4454be',
};

const Car = ({
  className = '',
  classNameActive = '',
  setConnectedDevices,
}: {
  className?: string;
  classNameActive?: string;
  setConnectedDevices: (number) => void;
}) => {
  const { addToast } = useToast();
  const bleDevice = useBLEDevice({
    filters: [{ name: 'SpeedWheels' }],
    chars: {
      motor: {
        UUID: BLE_UUID.SERVICE_MOTOR,
        characteristics: {
          motor: BLE_UUID.CHAR_MOTOR,
        },
      },
      led: {
        UUID: BLE_UUID.SERVICE_LED,
        characteristics: {
          char: BLE_UUID.CHAR_LED,
        },
      },
    },
    onConnected: () => setConnectedDevices((devices) => devices + 1),
    onDisconnected: () => setConnectedDevices((devices) => devices - 1),
  });
  return bleDevice.state === DEVICE_STATE.SUCCESS ? (
    <CarActive
      className={className + ' ' + classNameActive}
      ledChar={bleDevice.characteristics.led.char}
      motorChar={bleDevice.characteristics.motor.motor}
    />
  ) : (
    <button
      disabled={bleDevice.state === DEVICE_STATE.LOADING}
      onClick={() => bleDevice.connect()}
      className={className}
    >
      {bleDevice.state === DEVICE_STATE.LOADING ? (
        <Loader large centered />
      ) : (
        'Car'
      )}
    </button>
  );
};

export default Car;
