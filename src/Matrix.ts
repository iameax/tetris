import {Dimensions} from "./constants";

export default class Matrix<T> {
  private array;
  private _dimensions: Dimensions;

  constructor(values) {
    const rows: Array<Array<T>> = [];

    values.forEach(valuesRow => {
      const row = [...valuesRow];
      rows.push(row);
    });

    this.array = rows;
    this._dimensions = {rows: this.array.length, cols: this.array[0].length};
  }

  static create({rows, cols}: Dimensions) {
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
        this.array[i][j] = null;
      }
    }
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

  public clear() {
    this.fill(null);
  }

  public dimensions(): Dimensions {
    return this._dimensions;
  }

  public clone() {
    return new Matrix(this.array);
  }

  public entries() {
    return this.array.map((rowArray, row) => {
      return rowArray.map((value, col) => [{x: col, y: row}, value]);
    }).reduce((acc, item) => [...acc, ...item], []);
  }

  private boundsCheck(row, col) {
    return row >= 0 && col >= 0 && row < this._dimensions.rows && col < this._dimensions.cols;
  }
}