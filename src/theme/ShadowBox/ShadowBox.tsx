import React from 'react';
import cn from '@common/utils/classnames';
import { CloseButton } from '../index';
import styles from './ShadowBox.css';

export default ({
  title,
  children,
  close,
  size = 'large',
  className = '',
  preventClose,
}: {
  title?: string;
  children?: JSX.Element | JSX.Element[] | string;
  close: Function;
  size?: 'large' | 'small';
  className?: string;
  preventClose?: boolean;
}) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [shadow, setShadow] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShow(true);
    return () => {
      setShow(false);
    };
  }, []);

  const onClose = () => {
    if (preventClose) {
      return;
    }
    setShow(false);
    window.setTimeout(() => {
      close();
    }, 200);
  };

  return (
    <div
      className={cn(className, styles.root, {
        [styles.isSmall]: size === 'small',
      })}
      data-visible={show}
    >
      <div className={styles.shadow} onClick={onClose} />
      <article className={styles.box}>
        <header
          className={cn(styles.header, {
            [styles.headerShadow]: shadow,
          })}
        >
          {title !== null && <h1 className={styles.title}>{title}</h1>}{' '}
          {!preventClose && (
            <CloseButton className={styles.close} onClick={onClose} />
          )}
        </header>
        <div className={styles.content}>{children}</div>
      </article>
    </div>
  );
};
