import React from 'react';

export enum DEVICE_STATE {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

type CharacteristicsTree = Record<
  string,
  Record<string, BluetoothRemoteGATTCharacteristic>
>;

interface BLEDeviceI {
  state: DEVICE_STATE;
  device: BluetoothDevice;
  characteristics: CharacteristicsTree;
  error: string;
  connect: () => Promise<void>;
}

const useBLEDevice = ({
  filters,
  chars,
  onDisconnected = () => {},
  onConnected = () => {},
}: {
  filters: BluetoothRequestDeviceFilter[];
  chars: Record<
    string,
    {
      UUID: BluetoothServiceUUID;
      characteristics: Record<string, BluetoothCharacteristicUUID>;
    }
  >;
  onDisconnected?: (device: BluetoothDevice) => void;
  onConnected?: (device: BluetoothDevice) => void;
}): BLEDeviceI => {
  const [device, setDevice] = React.useState<BluetoothDevice>(null);
  const [deviceCharacteristics, setDeviceCharacteristics] =
    React.useState<CharacteristicsTree>(null);
  const [deviceState, setDeviceState] = React.useState<DEVICE_STATE>(
    DEVICE_STATE.IDLE
  );
  const [error, setError] = React.useState<string>('');

  const onDisconnectedInternal = (event) => {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
    setDeviceState(DEVICE_STATE.IDLE);
    setDevice(null);
    onDisconnected(event.target);
  };

  const connect = async (): Promise<void> => {
    setDeviceState(DEVICE_STATE.LOADING);
    setError('');
    setDevice(null);
    try {
      const device: BluetoothDevice = await navigator.bluetooth.requestDevice({
        //acceptAllDevices: true,
        filters,
        optionalServices: Object.values(chars).map((char) => char.UUID),
      });
      device.addEventListener('gattserverdisconnected', onDisconnectedInternal);
      const server = await device.gatt.connect();

      const getCharacteristicsByService = async (
        serviceKey
      ): Promise<
        [string, Record<string, BluetoothRemoteGATTCharacteristic>]
      > => {
        const element = chars[serviceKey];
        const service = await server.getPrimaryService(element.UUID);
        const characteristics = await Promise.all(
          Object.entries(element.characteristics).map(
            ([characteristicKey, charUUID]) =>
              service.getCharacteristic(charUUID)
          )
        );

        return [
          serviceKey,
          characteristics.reduce(
            (acc, char, i) => ({
              ...acc,
              [Object.keys(element.characteristics)[i]]: char,
            }),
            {}
          ),
        ];
      };

      const serviceChars: Array<
        [string, Record<string, BluetoothRemoteGATTCharacteristic>]
      > = await Promise.all(
        Object.keys(chars).map((serviceKey) =>
          getCharacteristicsByService(serviceKey)
        )
      );

      const characteristicTree: CharacteristicsTree = serviceChars.reduce(
        (acc, service, i) => ({ ...acc, [service[0]]: service[1] }),
        {}
      );

      setDevice(device);
      onConnected(device);
      setDeviceCharacteristics(characteristicTree);
      setDeviceState(DEVICE_STATE.SUCCESS);
    } catch (error) {
      setError(error.toString());
      setDeviceState(DEVICE_STATE.ERROR);
    }
  };

  return {
    state: deviceState,
    device,
    characteristics: deviceCharacteristics,
    error,
    connect,
  };
};

export default useBLEDevice;
