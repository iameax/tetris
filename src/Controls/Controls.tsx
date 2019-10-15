/* eslint-disable */
import React from 'react';
import cs from 'classnames';
import { Control } from '../common/constants';
import './style.scss';


interface Props {
  onTrigger: (control: Control) => void;
  togglers: {};
}

const Toggler = ({ className, value, onClick, children }) => (
  <button className={cs(className, { selected: value })} onClick={onClick}>{children}</button>
);

const Controls = ({ onTrigger, togglers }: Props) => {
  const makeClickHandler = (control: Control) => () => onTrigger(control);

  return (
    <div className="controls">
      <div className="controls__top">
        <div className="togglers">
          <Toggler
            className="power"
            value={togglers[Control.POWER]}
            onClick={makeClickHandler(Control.POWER)}>Power</Toggler>
          <Toggler
            className="pause"
            value={togglers[Control.PAUSE]}
            onClick={makeClickHandler(Control.PAUSE)}>Pause</Toggler>
          <Toggler
            className="mute"
            value={togglers[Control.MUTE]}
            onClick={makeClickHandler(Control.MUTE)}>Mute</Toggler>
          {/*<Toggler
            className="theme"
            value={togglers[Control.RGB]}
            onClick={makeClickHandler(Control.RGB)}>RGB</Toggler>*/}
        </div>

        <div className="actions">
          <button
            className="reset"
            onClick={makeClickHandler(Control.RESET)}>Reset</button>
        </div>
      </div>
      <div className="controls__bottom">
        <div className="arrows">
          <button
            className="arrow-up"
            onClick={makeClickHandler(Control.ARROW_UP)}>Up</button>
          <button
            className="arrow-left"
            onClick={makeClickHandler(Control.ARROW_LEFT)}>Left</button>
          <button
            className="arrow-right"
            onClick={makeClickHandler(Control.ARROW_RIGHT)}>Right</button>
          <button
            className="arrow-down"
            onClick={makeClickHandler(Control.ARROW_DOWN)}>Down</button>
        </div>
        <div className="action">
          <button onClick={makeClickHandler(Control.ACTION)}>Rotate</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Controls);