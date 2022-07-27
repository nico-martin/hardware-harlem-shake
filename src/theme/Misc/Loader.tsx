import React from 'react';
import cn from '@common/utils/classnames';
import styles from './Loader.css';

const Loader = ({
  className = '',
  large = false,
  centered = false,
  ...props
}: {
  className?: string;
  large?: boolean;
  centered?: boolean;
  [key: string]: any;
}) => (
  <svg
    className={cn(styles.root, className, {
      [styles.large]: large,
      [styles.centered]: centered,
    })}
    viewBox="0 0 40 40"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="20" cy="20" r="15" />
  </svg>
);

export default Loader;
