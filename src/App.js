import React from 'react';
import TrackerView from './components/tracker';
import MainSideBar from './components/mainsidebar';
import AboutView from './components/about';

import './App.css';
import 'rsuite/dist/styles/rsuite-dark.css'
import { render } from '@testing-library/react';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      aboutView: true,
      trackerView: false,
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView = (eventKey) => {
    if (eventKey === '1') {
      this.setState({
        aboutView: true,
        trackerView: false
      });
    }
    else if (eventKey === '2') {
      this.setState({
        aboutView: false,
        trackerView: true
      });
    }
  }
 
  render() {
    return (
      <div>
        <MainSideBar changeView={this.changeView}/>
        <AboutView displayed={this.state.aboutView}/>
        <TrackerView displayed={this.state.trackerView}/>
      </div>
    );
  }
}

export default App;
