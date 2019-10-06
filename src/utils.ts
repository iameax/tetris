import {ColorEnum, FIGURE_COLORS} from "./constants";


export const randomColor = () => {
  const index = Math.floor(Math.random() * FIGURE_COLORS.length);

  return FIGURE_COLORS[index];
};