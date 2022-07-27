import React from 'react';

export enum AUDIO_STATE {
  IDLE = 'IDLE',
  BUFFERING = 'BUFFERING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
}

interface HTMLAudioState {
  buffered: {
    start: number;
    end: number;
  };
  time: number;
  duration: number;
  playState: AUDIO_STATE;
  playbackRate: number;
  endedCallback: Function;
}

interface HTMLAudioControls {
  play: () => Promise<void> | void;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setEndedCallback: (callback: Function) => void;
}

interface HTMLAudioProps {
  src: string;
  autoPlay?: boolean;
  startPlaybackRate?: number;
  formats?: Array<{
    mimeType: string;
    src: string;
  }>;
  setError?: Function;
}

const parseTimeRange = (ranges) =>
  ranges.length < 1
    ? {
        start: 0,
        end: 0,
      }
    : {
        start: ranges.start(0),
        end: ranges.end(0),
      };

export default ({
  src,
  autoPlay = false,
  startPlaybackRate = 1,
  formats = [],
  setError = (error) => console.log(error),
}: HTMLAudioProps) => {
  const [state, setOrgState] = React.useState<HTMLAudioState>({
    buffered: {
      start: 0,
      end: 0,
    },
    time: 0,
    duration: 0,
    playState: AUDIO_STATE.IDLE,
    playbackRate: 1,
    endedCallback: null,
  });
  const setState = (partState: Partial<HTMLAudioState>) =>
    setOrgState({ ...state, ...partState });
  const ref = React.useRef<HTMLAudioElement | null>(null);

  const element = React.createElement(
    'audio',
    {
      ...(formats.length === 0 ? { src } : {}),
      controls: false,
      ref,
      onPlay: () => setState({ playState: AUDIO_STATE.PLAYING }),
      onPause: () => setState({ playState: AUDIO_STATE.PAUSED }),
      onWaiting: () => setState({ playState: AUDIO_STATE.BUFFERING }),
      onPlaying: () => setState({ playState: AUDIO_STATE.PLAYING }),
      onEnded: state.endedCallback,
      onDurationChange: () => {
        const el = ref.current;
        if (!el) {
          return;
        }
        const { duration, buffered } = el;
        setState({
          duration,
          buffered: parseTimeRange(buffered),
        });
      },
      onTimeUpdate: () => {
        const el = ref.current;
        if (!el) {
          return;
        }
        setState({ time: el.currentTime });
      },
      onProgress: () => {
        const el = ref.current;
        if (!el) {
          return;
        }
        setState({ buffered: parseTimeRange(el.buffered) });
      },
      onRateChange: () => {
        const el = ref.current;
        if (!el) {
          return;
        }
        setState({ playbackRate: el.playbackRate });
      },
      onError: () => setError('There was an error playing the audio file'),
    } as any,
    formats.map(({ mimeType, src }) => [
      React.createElement('source', {
        mime: mimeType,
        src,
        onError: () => setError('There was an error loading the audio file'),
      }),
    ])
  );

  // Some browsers return `Promise` on `.play()` and may throw errors
  // if one tries to execute another `.play()` or `.pause()` while that
  // promise is resolving. So we prevent that with this lock.
  // See: https://bugs.chromium.org/p/chromium/issues/detail?id=593273
  let lockPlay: boolean = false;

  const controls: HTMLAudioControls = {
    play: () => {
      const el = ref.current;
      if (!el) {
        return undefined;
      }

      if (!lockPlay) {
        const promise = el.play();
        const isPromise = typeof promise === 'object';

        if (isPromise) {
          lockPlay = true;
          const resetLock = () => {
            lockPlay = false;
          };
          promise.then(resetLock, resetLock);
        }

        return promise;
      }
      return undefined;
    },
    pause: () => {
      const el = ref.current;
      if (el && !lockPlay) {
        return el.pause();
      }
    },
    seek: (time: number) => {
      const el = ref.current;
      if (!el || state.duration === undefined) {
        return;
      }
      time = Math.min(state.duration, Math.max(0, time));
      el.currentTime = time || 0;
    },
    setPlaybackRate: (rate: number) => {
      const el = ref.current;
      if (!el || state.duration === undefined) {
        return;
      }

      setState({
        playbackRate: rate,
      });
      el.playbackRate = rate;
    },
    setEndedCallback: (callback: Function) => {
      setState({ endedCallback: callback });
    },
  };

  React.useEffect(() => {
    const el = ref.current!;
    el &&
      setState({
        playState: el.paused ? AUDIO_STATE.PAUSED : AUDIO_STATE.PLAYING,
      });

    controls.setPlaybackRate(startPlaybackRate);

    // Start media, if autoPlay requested.
    if (autoPlay && el.paused) {
      controls.play();
    }
  }, [src]);

  return { state, element, controls };
};
