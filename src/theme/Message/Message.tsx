import React from 'react';
import cn from '@common/utils/classnames';
import { Icon } from '../index';
import styles from './Message.css';

export enum MESSAGE_TYPES {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

const Message = ({
  className = '',
  classNameContent = '',
  type,
  children,
}: {
  className?: string;
  classNameContent?: string;
  type?: string;
  children: any;
}) => (
  <div
    className={cn(
      styles.root,
      styles[type || MESSAGE_TYPES.SUCCESS],
      className
    )}
  >
    <Icon
      className={styles.icon}
      icon={`mdi/${type === MESSAGE_TYPES.SUCCESS ? 'check' : 'alert'}`}
    />
    <p className={cn(styles.content, classNameContent)}>{children}</p>
  </div>
);

export default Message;
