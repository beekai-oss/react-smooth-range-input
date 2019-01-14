import React, { Component } from 'react';
import { Slider } from './src/index';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🎚 React Smooth Input Range</h1>
          <p
            style={{
              fontWeight: 'lighter',
              fontSize: '30px',
              marginTop: '-10px',
            }}
          >
            Making input range beautiful and elegant
          </p>
          <div style={{ padding: '50px 20px 20px', width: '50%' }}>
            <Slider value={1} min={1} max={30} />
            <br />
            <br />
            <br />
            <Slider value={5} min={1} max={30} type="thin" padding={0} hasTickMarks={false} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
