import { Dimensions } from './types';


export default class Matrix<T> {
  public dimensions;
  public array;

  constructor(values) {
    const rows: Array<Array<T>> = [];

    values.forEach(valuesRow => {
      const row = [...valuesRow];
      rows.push(row);
    });

    this.array = rows;
    this.dimensions = {rows: this.array.length, cols: this.array[0].length || 0};
  }

  get rows() {
    return this.dimensions.rows;
  }

  get cols() {
    return this.dimensions.cols;
  }

  static create<U>({rows, cols}: Dimensions): Matrix<U> {
    const array: Array<Array<any>> = [];

    for (let i = 0; i < rows; i++) {
      array[i] = [];
      for (let j = 0; j < cols; j++) {
        array[i][j] = null;
      }
    }

    return new Matrix(array);
  }

  public fill(value: T) {
    for (let i = 0; i < this.array.length; i++) {
      for (let j = 0; j < this.array[0].length; j++) {
        this.array[i][j] = value;
      }
    }
  }

  public map(mapFn: (value: T, indexes: { row: number; col: number }) => T) {
    return this.array.map((rowValues, row) => rowValues.map((value, col) => mapFn(value, {row, col})));
  }

  public set(row: number, col: number, value: any) {
    if (this.boundsCheck(row, col)) {
      this.array[row][col] = value;
    }
  }

  public get(row: number, col: number) {
    if (this.boundsCheck(row, col)) {
      return this.array[row][col];
    }

    return null;
  }

  public getRow(row: number) {
    return this.array[row];
  }

  public setRow(row, values: Array<T>) {
    this.array[row] = values;
  }

  public addRow(values: Array<T>) {
    this.array.unshift(values);
  }

  public deleteRow(row) {
    this.array.splice(row, 1);
  }

  public clear() {
    this.fill(null);
  }

  public clone() {
    return new Matrix(this.array);
  }

  public entries() {
    return this.array.map((rowArray, row) => rowArray.map((value, col) => [{
      x: col,
      y: row,
    }, value])).reduce((acc, item) => [...acc, ...item], []);
  }

  * [Symbol.iterator]() {
    for (let y = 0; y < this.array.length; y++) {
      for (let x = 0; x < this.array[0].length; x++) {
        yield [{ x, y }, this.array[y][x]];
      }
    }
  }

  private boundsCheck(row, col) {
    return row >= 0 && col >= 0 && row < this.rows && col < this.cols;
  }
}