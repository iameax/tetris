import { Control } from '../common/constants';
import { useCallback, useReducer } from 'react';


const reducer = (state, action) => {
  const toggleState = (name) => ({ ...state, [name]: !state[name] });

  if (action.type === Control.RESET) {
    return action.state;
  }

  if (Object.values(Control).includes(action.type)) {
    return toggleState(action.type);
  }

  return state;
};

const useTogglersState = () => {
  const initialState = {
    [Control.POWER]: true,
    [Control.PAUSE]: false,
    [Control.MUTE]: false,
    [Control.RGB]: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleControl = useCallback(
    (control: Control) => dispatch({ type: control }),
    [],
  );

  const resetControls = useCallback(
    () => dispatch({ type: Control.RESET, state: initialState }),
    [],
  );

  return [state, toggleControl, resetControls];
};

export default useTogglersState;