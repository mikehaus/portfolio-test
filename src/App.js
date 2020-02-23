import React from 'react';
import TrackerView from './components/tracker'

import './App.css';
import 'rsuite/dist/styles/rsuite-dark.css'
import { render } from '@testing-library/react';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      trackerView: true,
    };

  }

  render() {
    return (
      <div>
        <TrackerView displayed={this.state.trackerView}/>
      </div>
    );
  }
}

export default App;
