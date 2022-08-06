import React from 'react';
import { Button } from '@theme';
import styles from './HarlemShakeContext.css';

export enum AUDIO_STATE {
  IDLE = 'IDLE',
  BUFFERING = 'BUFFERING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
}

interface HarlemShakeContextI {
  stop: () => void;
  start: (restart?: boolean) => void;
  isPlaying: boolean;
  pulse: number;
  matrix: Array<number>;
  beat: number;
  isHalfBeat: boolean;
  beatPulse: number;
}

const HarlemShakeContext = React.createContext<HarlemShakeContextI>({
  stop: () => {},
  start: () => {},
  isPlaying: false,
  pulse: 0,
  matrix: null,
  beat: 0,
  isHalfBeat: false,
  beatPulse: 0,
});

const BAR_HEIGHT_COUNT = 16;
const FULL_BAR_COUNT = 32;
const WIDTH = BAR_HEIGHT_COUNT * 100;
const HEIGHT = BAR_HEIGHT_COUNT * 100;
const BAR_RANGE_OFFSET_START = 1000;
let beatIntervalSet: boolean = false;
let beatInterval: NodeJS.Timer = null;
const intervalTime = 860;
const startDelay = 860;
const showCanvas = true;

const HarlemShakeProvider = ({ children }: { children: JSX.Element }) => {
  const audioRef = React.useRef<HTMLMediaElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [playState, setPlayState] = React.useState<AUDIO_STATE>(
    AUDIO_STATE.IDLE
  );
  const [analyser, setAnalyser] = React.useState<AnalyserNode>(null);
  const [matrix, setMatrix] = React.useState<Array<number>>(null);
  const [doublePulse, setDoublePulse] = React.useState<number>(null);

  const maybeStartBeat = () => {
    if (!beatIntervalSet) {
      beatIntervalSet = true;
      setTimeout(() => {
        beatInterval = setInterval(
          () => setDoublePulse((pulse) => pulse + 1),
          intervalTime / 2
        );
      }, startDelay);
    }
  };

  const maybeEndBeat = () => {
    if (beatIntervalSet) {
      clearInterval(beatInterval);
      setDoublePulse(null);
      beatInterval = null;
      beatIntervalSet = false;
    }
  };

  const tick = () => {
    //requestAnimationFrame(tick);

    const ctx = canvasRef.current ? canvasRef.current.getContext('2d') : null;
    const dataArray = new Uint8Array(FULL_BAR_COUNT);
    const barWidth = WIDTH / FULL_BAR_COUNT;
    let x = 0;
    analyser.getByteFrequencyData(dataArray);
    const isRunning = dataArray.filter(Boolean).length !== 0;
    isRunning ? maybeStartBeat() : maybeEndBeat();

    if (ctx) {
      ctx.fillStyle = 'rgba(79,79,79,1)'; // Clears canvas before rendering bars (black with opacity 0.2)
      ctx.fillRect(0, 0, WIDTH, HEIGHT); // Fade effect, set opacity to 1 for sharper rendering of bars
    }
    setMatrix(
      new Array(FULL_BAR_COUNT)
        .fill('')
        .map((e, i) => dataArray[i] / 255)
        .map((barHeightZeroToOne) => {
          const fullBarHeight = HEIGHT + BAR_RANGE_OFFSET_START;
          const height = barHeightZeroToOne * fullBarHeight;
          const pixelHeight = Math.floor(height / 100);

          if (ctx) {
            ctx.fillStyle = `rgb(${200},${200},${200})`;
            ctx.fillRect(
              x,
              fullBarHeight - pixelHeight * 100,
              barWidth,
              height * 100 + BAR_RANGE_OFFSET_START
            );
          }
          x += barWidth;
          const pixelBarHeight = pixelHeight - BAR_RANGE_OFFSET_START / 100;
          return pixelBarHeight <= 0 ? 0 : pixelBarHeight;
        })
    );
  };

  const setUp = () => {
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(
      audioRef.current as HTMLMediaElement
    );
    const analyser = audioContext.createAnalyser();
    track.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    setAnalyser(analyser);
  };

  React.useEffect(() => {
    analyser && window.setInterval(tick, 50);
  }, [analyser]);

  const start = () => (audioRef.current ? audioRef.current.play() : null);
  const stop = () => (audioRef.current ? audioRef.current.pause() : null);
  const pulse = Math.floor(doublePulse / 2);
  const beat = Math.floor((pulse - 1) / 4) + 1;

  return (
    <HarlemShakeContext.Provider
      value={{
        pulse: 0,
        start,
        stop,
        isPlaying: playState === AUDIO_STATE.PLAYING,
        matrix,
        beat,
        isHalfBeat: (doublePulse / 2) % 1 !== 0,
        beatPulse: beat === 0 ? 0 : pulse - (beat - 1) * 4,
      }}
    >
      <audio
        id="audio"
        controls={true}
        src="./assets/static/harlem-shake.mp3"
        ref={audioRef}
        onPlay={() => setPlayState(AUDIO_STATE.PLAYING)}
        onPause={() => {
          setPlayState(AUDIO_STATE.PAUSED);
          setDoublePulse(0);
          audioRef.current.currentTime = 0;
        }}
        onWaiting={() => setPlayState(AUDIO_STATE.BUFFERING)}
        onPlaying={() => setPlayState(AUDIO_STATE.PLAYING)}
        autoPlay={false}
        style={{ opacity: 0 }}
      />
      {showCanvas && (
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: 0.5,
          }}
        />
      )}
      {!analyser ? (
        <Button onClick={setUp} large className={styles.setup}>
          Setup Audio
        </Button>
      ) : (
        children
      )}
    </HarlemShakeContext.Provider>
  );
};

export default HarlemShakeProvider;

export const useHarlemShake = (): HarlemShakeContextI =>
  React.useContext(HarlemShakeContext);
