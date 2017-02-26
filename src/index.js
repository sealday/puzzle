import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game';
import GameUI from './game.ui';
import './index.css';

ReactDOM.render(
  <GameUI game={new Game()}/>,
  document.getElementById('root')
);
