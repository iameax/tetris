import { useCallback, useEffect, useRef } from 'react';
import { Control, KeyCode } from '../common/constants';
import { ControlManager, ControlHandler } from '../common/types';


const KEYS_MAPPINGS = {
  [KeyCode.SPACE]: Control.ACTION,
  [KeyCode.ESC]: Control.RESET,
  [KeyCode.ENTER]: Control.POWER,
  [KeyCode.ARROW_LEFT]: Control.ARROW_LEFT,
  [KeyCode.ARROW_RIGHT]: Control.ARROW_RIGHT,
  [KeyCode.ARROW_DOWN]: Control.ARROW_DOWN,
  [KeyCode.ARROW_UP]: Control.ARROW_UP,
  [KeyCode.P]: Control.PAUSE,
  [KeyCode.M]: Control.MUTE,
};

const useControlManager = (): ControlManager => {
  const handlersRef = useRef(new Map<Control | string, ControlHandler[]>());

  const trigger = useCallback(
    (control: Control) => {
      const handlers = handlersRef.current.get(control) || [];
      handlers.forEach(handler => {
        handler();
      });
    },
    [],
  );

  const addHandler = useCallback(
    (control: Control, handler: ControlHandler) => {
      const controlHandlers = handlersRef.current.get(control) || [];
      handlersRef.current.set(control, [...controlHandlers, handler]);
    },
    [],
  );

  const addHandlers = useCallback(
    (handlers: {}) => {
      for (const control in handlers) {
        const controlHandlers = handlersRef.current.get(control) || [];
        handlersRef.current.set(control, [...controlHandlers, handlers[control]]);
      }
    },
    [],
  );

  // trigger control on keydown
  useEffect(
    () => {
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code in KEYS_MAPPINGS) {
          trigger(KEYS_MAPPINGS[e.code]);
        }
      });
    },
    [],
  );

  return {
    trigger,
    addHandler,
    addHandlers,
  };
};

export default useControlManager;