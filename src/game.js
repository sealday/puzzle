/**
 * Created by seal on 26/02/2017.
 */
import _ from 'lodash';
import test from './test.jpeg';
import start from './start.jpg';
import $ from 'jquery';

const mileseconds = 2000;

const IDLE = 'IDLE';
const STARTING = 'STARTING';
const STARTED = 'STARTED';

let scores = [
  { name: 'computer', time: 9998.0 },
  { name: 'computer', time: 9997.0 },
  { name: 'computer', time: 9999.0 },
  { name: 'computer', time: 10000.0 },
];

const createOrderedMap = () => {
  let map = _.times(4, _.stubArray);
  _.range(16).forEach((e, index) => {
    map[parseInt(index / 4, 10)].push(e);
  });
  return map;
};

const createRandomMap = () => {
  let map = _.times(4, _.stubArray);
  _.shuffle(_.range(16)).forEach((e, index) => {
    map[parseInt(index / 4, 10)].push(e);
  });

  map = createOrderedMap();
  map[0][2] = 3;
  map[0][3] = 2;
  return map;
};

export default class Game {
  constructor() {
    document.addEventListener('keydown', this.onkeydown.bind(this));

    this._resetCurrent();
    this.image = start;
    this.map = createOrderedMap();
    console.log(this.map);

    this._state = IDLE;
  }

  _resetCurrent() {
    this.current = [-1, -1];
    if (this.onCurrentChange) {
      this.onCurrentChange(this.current);
    }
  }

  showHighScore() {
    if (this._state !== STARTING) {
      this._resetCurrent();
      this._state = IDLE;
      let canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      let ctx = canvas.getContext('2d');
      ctx.fillStyle = '#adb';
      ctx.fillRect(0, 0, 640, 480);
      ctx.font = '48px serif';
      ctx.strokeText("high score", 100, 100);

      ctx.fillStyle = '#000';
      _.take(_.sortBy(scores, o => o.time), 3).forEach((score, index) => {
        ctx.fillText(`${index}   ${score.name}  ${score.time}`, 140, 160 + index * 70);
      });

      this.map = createOrderedMap();
      this.image = canvas.toDataURL("image/jpeg");
      this.onMapChange(this.map, this.image);
    }
  }

  start() {
    if (this._state !== STARTING) {
      this._state = STARTING;
      this.image = test;
      this._resetCurrent();
      this.map = createOrderedMap();
      this.onMapChange(this.map, this.image);

      setTimeout(() => {
        this.current = [0, 3];
        this._state = STARTED;
        this.map = createRandomMap();
        this.onMapChange(this.map, this.image);
        this.onCurrentChange(this.current);

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
    this.onMapChange(this.map, this.image);

    if (this._state === STARTED && _.isEqual(_.range(16), _.flatten(this.map))) {
      this._endTime = new Date();
      setTimeout(() => {
        this.onSuccess(this._endTime - this._startTime);
      }, 0);
      this._state = IDLE
    }

  }
}
