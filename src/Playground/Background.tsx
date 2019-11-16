import React, { useContext, useEffect, useRef } from 'react';
import { Color, Dimensions } from '../common/types';
import { ThemeContext } from '../common/ThemeContext';


interface Props {
  scale: number;
  dimensions: Dimensions;
}

const makeDots = (ctx: CanvasRenderingContext2D, { rows, cols }: Dimensions, color: Color) => {
  ctx.fillStyle = color;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.beginPath();
      ctx.arc(x + 0.5, y + 0.5, 0.03, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  }
};

const Background = ({ dimensions, scale }: Props) => {
  const canvasRef = useRef(null);

  const isRGB = useContext(ThemeContext);

  useEffect(
    () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.save();
      ctx.scale(scale, scale);
      ctx.lineWidth = 1 / scale;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { rows, cols } = dimensions;
    ctx.fillStyle = isRGB ? '#aaa' : '#a3b6ac';
    ctx.fillRect(0, 0, cols, rows);

    makeDots(ctx, dimensions, isRGB ? 'black' : 'black');
  }, [isRGB]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.cols * scale}
      height={dimensions.rows * scale}
      className="background"
    />
  );
};

export default Background;
