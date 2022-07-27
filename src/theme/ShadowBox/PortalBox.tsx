import React from 'react';
import ReactDOM from 'react-dom';
import { ShadowBox } from '../index';

const Portal = ({ children }: { children?: JSX.Element }) =>
  ReactDOM.createPortal(children, document.querySelector('#shadowbox'));

export default ({
  children,
  close,
  size,
  ...props
}: {
  children?: JSX.Element | JSX.Element[] | string;
  close: Function;
  size?: 'large' | 'small';
  [key: string]: any;
}) => (
  <Portal>
    <ShadowBox children={children} close={close} size={size} {...props} />
  </Portal>
);
