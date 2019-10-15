export const calculatePoints = (collapsedLines: number, level: number) => Math.floor((collapsedLines ** 2 * 10) * Math.sqrt(level));

export const calculateLevel = (score: number): number => Math.ceil(score / 100);