import React from 'react';
import ReactDOM from 'react-dom';
import test from './test.jpeg';
import './index.css';

const width = 640;
const height = 480;

const perWidth = width / 4;
const perHeight = height / 4;

const margin = 2;

const Part = ({row, col}) => (
  <div style={{
    margin: `${margin}px`,
    background: `url(${test})`,
    backgroundPosition: `-${col * perWidth}px -${row * perHeight}px`,
    display: 'inline-block',
    width: width / 4, height: height / 4}}
  />
);

ReactDOM.render(
  <div>
    <div style={{
      margin: '0 auto',
      width: `${width + margin * 8}px`,
      padding: '10px',
      background: '#bbada0',
      borderRadius: '10px',
    }}
    >
      {getRandomArray([0, 1, 2, 3]).map(row => (
        <div key={row}>
          {getRandomArray([0, 1, 2, 3]).map(col => (
            <Part key={col} col={col} row={row} />
          ))}
        </div>
      ))}
    </div>
  </div>,
  document.getElementById('root')
);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArray(array) {
  let result = [];
  while(array.length > 0) {
    result.push(array.splice(getRandomInt(0, array.length), 1)[0]);
  }
  return result;
}


window.getRandomArray = getRandomArray
