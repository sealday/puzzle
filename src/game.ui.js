/**
 * Created by seal on 26/02/2017.
 */
import React from 'react';
import Game from './game';
import shortid from 'shortid';

const width = 640;
const height = 480;

const perWidth = width / 4;
const perHeight = height / 4;

const margin = 2;

const Part = ({row, col, current, image}) => {
  return (
    <div style={{
      margin            : `${margin}px`,
      background        : current ? '#bbada0' : `url(${image})`,
      backgroundPosition: `-${col * perWidth}px -${row * perHeight}px`,
      display           : 'inline-block',
      boxSizing         : 'border-box',
      border            : current ? 'solid 1px blue' : 'none',
      width             : width / 4, height: height / 4
    }}
    />
  );
};

export default class GameUI extends React.Component {
  static protoTypes = {
    game: React.PropTypes.objectOf(Game)
  };

  constructor(props) {
    super(props);
    this.state = {
      current: props.game.current,
      map: props.game.map,
      image: props.game.image,
      seconds: 0,
    };
    props.game.onCurrentChange = this.onCurrentChange.bind(this);
    props.game.onMapChange = this.onMapChange.bind(this);
    props.game.onSuccess = this.onSuccess.bind(this);
  }

  isCurrent(row, col) {
    return row === this.state.current[0] && col === this.state.current[1];
  }

  onCurrentChange(current) {
    this.setState({
      current
    });
  }

  onSuccess(time) {
    alert('congratulation!');
  }

  onMapChange(map, image) {
    this.setState({
      map,
      image
    });
  }

  start() {
    this.props.game.start();
  }

  render() {
    return (
      <div>
        <div style={{
          margin: '0 auto',
          width: `${width + margin * 8}px`,
          padding: '10px',
          background: '#bbada0',
          borderRadius: '10px',
        }}
        >
          <div>
            <button onClick={e => this.start()}>New game</button>
            <button onClick={e => this.props.game.showHighScore()}>High scores</button>
          </div>
          {this.state.map.map((row, rowIndex) => (
            <div key={shortid.generate()} style={{ marginBottom: '-4px' }}>
              {row.map((value, colIndex) => (
                <Part
                  key={shortid.generate()}
                  col={value % 4}
                  row={parseInt(value / 4, 10)}
                  current={this.isCurrent(rowIndex, colIndex)}
                  image={this.state.image}
                />
              ))}
            </div>
          ))}
          <div>
            <p>Time: {this.state.seconds} seconds</p>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this._checkTime = setInterval(() => {
      this.setState((state, props) => ({
        seconds: (props.game.seconds / 1000).toFixed(1)
      }));
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this._checkTime);
  }


}
