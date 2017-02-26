/**
 * Created by seal on 26/02/2017.
 */
import _ from 'lodash';
import test from './test.jpeg';
import start from './start.jpg';

const mileseconds = 2000;

const IDLE = 'IDLE';
const STARTING = 'STARTING';
const STARTED = 'STARTED';

export default class Game {
  constructor() {
    document.addEventListener('keydown', this.onkeydown.bind(this));

    this.current = [0, 3];

    this.image = start;
    this.map = _.times(4, _.stubArray);
    _.range(16).forEach((e, index) => {
      this.map[parseInt(index / 4, 10)].push(e);
    });

    this._state = IDLE;
  }

  start() {
    if (this._state !== STARTING) {
      this._state = STARTING;
      this.image = test;

      this.map = _.times(4, _.stubArray);
      _.range(16).forEach((e, index) => {
        this.map[parseInt(index / 4, 10)].push(e);
      });
      this.onMapChange(this.map, this.image);

      setTimeout(() => {
        this._state = STARTED;
        this.map = _.times(4, _.stubArray);
        _.shuffle(_.range(16)).forEach((e, index) => {
          this.map[parseInt(index / 4, 10)].push(e);
        });
        this.onMapChange(this.map, this.image);

        this._startTime = new Date();
      }, mileseconds);
    }
  }

  get seconds() {
    return this._state === STARTED
      ? new Date() - this._startTime
      : 0;
  }

  onkeydown(e) {
    e.preventDefault();

    let row = this.current[0];
    let col = this.current[1];
    let temp;

    switch (e.key) {
      case 'ArrowLeft':
        if (this.current[1] < 3) {
          this.current[1] += 1;
          temp = this.map[row][col];
          this.map[row][col] = this.map[row][col + 1];
          this.map[row][col + 1] = temp;
        }
        break;
      case 'ArrowRight':
        if (this.current[1] > 0) {
          this.current[1] -= 1;
          temp = this.map[row][col];
          this.map[row][col] = this.map[row][col - 1];
          this.map[row][col - 1] = temp;
        }
        break;
      case 'ArrowUp':
        if (this.current[0] < 3) {
          this.current[0] += 1;
          temp = this.map[row][col];
          this.map[row][col] = this.map[row + 1][col];
          this.map[row + 1][col] = temp;
        }
        break;
      case 'ArrowDown':
        if (this.current[0] > 0) {
          this.current[0] -= 1;
          temp = this.map[row][col];
          this.map[row][col] = this.map[row - 1][col];
          this.map[row - 1][col] = temp;
        }
        break;
      default:
        // do nothing
    }
    console.log(this.current);

    this.onCurrentChange(this.current);
    this.onMapChange(this.map);

    if (this._state === STARTED && _.isEqual(_.range(16), _.flatten(this.map))) {
      this._endTime = new Date();
      this.onSuccess(this._endTime - this._startTime);
    }

  }
}
