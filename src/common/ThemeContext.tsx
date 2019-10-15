import React from 'react';


export enum Theme {
  CLASSIC,
  COLORED,
}

export const ThemeContext = React.createContext(Theme.CLASSIC);
