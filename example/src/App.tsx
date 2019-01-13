import React, { Component } from 'react';
import { Slider } from './src/index';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ padding: '250px 20px 20px', width: '80%' }}>
            <Slider value={1} min={1} max={30} />
          </div>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
