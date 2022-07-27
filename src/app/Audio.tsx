import React from 'react';
import { Icon, Button } from '@theme';
import cn from '@common/utils/classnames';
import { useHarlemShake } from '../HarlemShakeContext';
import styles from './Audio.css';

const Audio = ({
  className = '',
  disabled,
}: {
  className?: string;
  disabled: boolean;
}) => {
  const { pulse, isPlaying, stop, start } = useHarlemShake();

  return (
    <div className={cn(className, styles.root)}>
      {isPlaying ? (
        <Button
          className={styles.button}
          onClick={() => stop()}
          icon="mdi/pause"
        />
      ) : (
        <Button
          className={styles.button}
          onClick={() => start()}
          icon="mdi/play"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default Audio;
