import { Dimensions, Shape } from '../common/types';
import Matrix from '../common/Matrix';
import React, { useMemo } from 'react';
import CanvasGrid from '../CanvasGrid';


const ShapeCanvas = ({ shape, dimensions }: { shape: Shape; dimensions: Dimensions }) => {
  const shapeMatrix: Matrix<number> = useMemo(
    () => {
      const { rows: shapeRows, cols: shapeCols } = shape.dimensions;
      const { rows: boardRows, cols: boardCols } = dimensions;

      const offsetX = Math.ceil(boardCols / 2) - Math.ceil(shapeCols / 2);
      const offsetY = Math.ceil(boardRows / 2) - Math.ceil(shapeRows / 2);

      const matrix: Matrix<number> = Matrix.create(dimensions);
      // const color = randomColor();

      for (const [{ x, y }, value] of shape) {
        matrix.set(y + offsetY, x + offsetX, value);
      }

      return matrix;
    },
    [shape]
  );

  return (
    <CanvasGrid
      className={'next-shape'}
      scale={10}
      dimensions={dimensions}
      state={shapeMatrix}
    />
  );
};

export default ShapeCanvas;
