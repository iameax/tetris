import { useCallback, useRef } from 'react';
import { Sound } from '../common/constants';


const useSoundPlayer = (mute: boolean) => {
  const audios = useRef({
    [Sound.ROTATE]: new Audio('./sounds/block-rotate.mp3'),
    [Sound.BLOCK]: new Audio('./sounds/force-hit.mp3'),
    [Sound.LAND]: new Audio('./sounds/slow-hit.mp3'),
    [Sound.COLLAPSE]: new Audio('./sounds/whoosh.mp3'),
    [Sound.PAUSE]: new Audio('./sounds/pause.mp3'),
    [Sound.GAMEOVER]: new Audio('./sounds/gameover.mp3'),
  });

  const playSound = useCallback(
    (type: string) => {
      const audio: HTMLAudioElement = audios.current[type];

      if (audio && !mute) {
        audio.currentTime = 0;
        audio.play();
      }
    },
    [mute]
  );

  return {
    play: playSound,
  };
};

export default useSoundPlayer;