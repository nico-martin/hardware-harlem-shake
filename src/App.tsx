import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon, Message } from '@theme';
import cn from '@common/utils/classnames';
import { generateRainbowColors } from '@common/utils/helpers';
import styles from './App.css';
import HarlemShakeProvider from './HarlemShakeContext';
import Audio from './app/Audio';
import Car from './app/Car';
import Footer from './app/Footer';
import LightBulb from './app/LightBulb';
import MatrixDevice from './app/MatrixDevice';
import { ToastProvider } from './app/toast/toastContext';

const BROWSER_SUPPORT = 'bluetooth' in navigator;

const App = () => {
  const [connectedDevices, setConnectedDevices] = React.useState<number>(0);

  return (
    <ToastProvider>
      <HarlemShakeProvider>
        <div className={styles.root}>
          {BROWSER_SUPPORT ? (
            <React.Fragment>
              <div className={styles.devices}>
                <LightBulb
                  className={cn(styles.lightBulb, styles.button)}
                  classNameActive={cn(styles.buttonActive)}
                  setConnectedDevices={setConnectedDevices}
                />
                <MatrixDevice
                  className={cn(styles.matrixLeft, styles.button)}
                  classNameActive={cn(styles.buttonActive)}
                  setConnectedDevices={setConnectedDevices}
                  side="left"
                />
                <Car
                  className={cn(styles.car, styles.button)}
                  classNameActive={cn(styles.buttonActive)}
                  setConnectedDevices={setConnectedDevices}
                />
                <MatrixDevice
                  className={cn(styles.matrixRight, styles.button)}
                  classNameActive={cn(styles.buttonActive)}
                  setConnectedDevices={setConnectedDevices}
                  side="right"
                />
              </div>
              <Audio
                className={styles.audio}
                //disabled={connectedDevices !== 3}
                disabled={false}
              />
            </React.Fragment>
          ) : (
            <Message type="error" className={styles.connectionError}>
              Your browser does not support the WebBluetooth API:{' '}
              <a href="https://caniuse.com/web-bluetooth" target="_blank">
                https://caniuse.com/web-bluetooth
              </a>
            </Message>
          )}
          <Footer className={cn(styles.footer)} />
        </div>
      </HarlemShakeProvider>
    </ToastProvider>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
