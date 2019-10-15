import React from 'react';
import { Dimensions } from '../common/types';
import Matrix from '../common/Matrix';
import { bwCellRenderer, CellRenderer, coloredCellRenderer } from './renderers';
import { Theme, ThemeContext } from '../common/ThemeContext';


interface Props<T> {
  state?: Matrix<T>;
  dimensions: Dimensions;
  scale: number;
  className?: string;
  offset?: { x: number; y: number };
  ref?: any;
}

const RENDERERS = {
  [Theme.CLASSIC]: bwCellRenderer,
  [Theme.COLORED]: coloredCellRenderer,
};

class CanvasGrid extends React.PureComponent<Props<number>> {
  canvasRef: { current: HTMLCanvasElement };

  static contextType = ThemeContext;
  context: React.ContextType<typeof ThemeContext>;

  constructor(props: Props<number>) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.scale(this.props.scale, this.props.scale);
    ctx.lineWidth = 2 / this.props.scale;

    if (this.props.state) {
      this.refresh(this.props.state);
    }
  }

  componentDidUpdate(): void {
    if (this.props.state) {
      this.refresh(this.props.state);
    }
  }

  private refresh(state: Matrix<number>) {
    this.clear();
    this.paint(state);
  }

  public paint(state: Matrix<number>, offset: { x: number; y: number } = { x: 0, y: 0 }) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (state) {
      this.renderMatrix(ctx, state, offset);
    }
  }

  public clear() {
    const { rows, cols } = this.props.dimensions;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, cols, rows);
  };

  renderMatrix(ctx, matrix, offset) {
    const cellRenderer: CellRenderer<any> = RENDERERS[this.context];
    if (!cellRenderer) {
      return;
    }

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        cellRenderer(ctx, x + offset.x, y + offset.y, matrix.get(y, x));
      }
    }
  };

  render() {
    const { className, dimensions, scale } = this.props;

    return (
      <canvas
        ref={this.canvasRef}
        className={className}
        width={dimensions.cols * scale}
        height={dimensions.rows * scale}
      />
    );
  }
};

export default CanvasGrid;
