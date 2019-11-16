import React, { useCallback, useEffect, useState } from 'react';
import InfoPanel from '../InfoPanel';
import Playground from '../Playground';
import { randomShape } from '../common/utils';
import Controls from '../Controls';
import useControlManager from './useControlManager';
import useSoundPlayer from './useSoundPlayer';
import { Control } from '../common/constants';
import useTogglersState from './useTogglersState';
import { Theme, ThemeContext } from '../common/ThemeContext';
import { calculateLevel, calculatePoints } from './calculations';


interface Props {
  level?: number;
  score?: number;
}

/**
 * Connects Playground & InfoPanel
 */
const Game = () => {
  const [togglers, toggleControl, resetControls] = useTogglersState();
  const [level, setLevel] = useState(5);
  const [score, setScore] = useState(0);

  const [nextShape, setNextShape] = useState(randomShape());
  const [playgroundKey, setPlaygroundKey] = useState(Math.random());

  const controlManager = useControlManager();
  const soundPlayer = useSoundPlayer(togglers[Control.MUTE]);

  useEffect(
    () => {
      controlManager.addHandlers({
        [Control.RESET]: () => {
          setLevel(1);
          setScore(0);
          resetControls();
          setPlaygroundKey(Math.random());
          setNextShape(randomShape());
        },
        [Control.POWER]: () => toggleControl(Control.POWER),
        [Control.PAUSE]: () => toggleControl(Control.PAUSE),
        [Control.MUTE]: () => toggleControl(Control.MUTE),
        [Control.RGB]: () => toggleControl(Control.RGB),
      });
    },
    []
  );

  const onShapeChange = useCallback(
    () => {
      setNextShape(randomShape());
    },
    [],
  );

  const onGameOver = useCallback(
    () => {
    },
    [],
  );

  const onCollapse = useCallback(
    (lines) => {
      const newScore = score + calculatePoints(lines, level);
      setScore(newScore);

      const newLevel = calculateLevel(newScore);
      setLevel(newLevel);
    },
    [level],
  );

  const playground = (
    <Playground
      key={playgroundKey}
      playSound={soundPlayer.play}
      addHandlers={controlManager.addHandlers}
      level={level}
      nextShape={nextShape}
      pause={togglers[Control.PAUSE]}
      onShapeChange={onShapeChange}
      onCollapse={onCollapse}
      onGameOver={onGameOver}
    />
  );

  const infoPanel = (
    <InfoPanel
      level={level}
      score={score}
      nextShape={nextShape}
    />
  );

  return (
    <ThemeContext.Provider value={togglers[Control.RGB] ? Theme.COLORED : Theme.CLASSIC}>
      <div id={'gamepad'}>
        <div className={'monitor'}>
          { togglers[Control.POWER] && playground }
          { togglers[Control.POWER] && infoPanel }
        </div>
        <Controls
          onTrigger={controlManager.trigger}
          togglers={togglers}
        />
      </div>
    </ThemeContext.Provider>
  );
};

export default Game;
