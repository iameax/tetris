import React from 'react';
import { Shape } from '../common/types';

import './style.scss';
import ShapeCanvas from './ShapeCanvas';

interface InfoPanelProps {
  level: number;
  score: number;
  nextShape: Shape;
}

const SHAPE_BOARD_DIMENSIONS = { rows: 4, cols: 4 };

/**
 * Displays stats, renders nextShape
 */
const InfoPanel = ({ level, score, nextShape }: InfoPanelProps) => (
  <div id="info">
    <div className="next-shape">
      <span className="label">Next:</span>
      <div className="value">
        <ShapeCanvas
          dimensions={SHAPE_BOARD_DIMENSIONS}
          shape={nextShape}
        />
      </div>
    </div>
    <div className="score">
      <span className="label">Score:</span>
      <div
        id="score"
        className="value">
        { score }
      </div>
    </div>
    <div className="level">
      <span className="label">Level:</span>
      <div className="value">
        { level }
      </div>
    </div>
  </div>
);

export default InfoPanel;
