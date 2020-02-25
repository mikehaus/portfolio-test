import React from 'react';
import TrackerView from './components/tracker/tracker';
import MainSideBar from './components/mainsidebar';
import AboutView from './components/about';
import WeatherView from './components/weather/weatherview';

import './App.css';
import 'rsuite/dist/styles/rsuite-dark.css'
import { render } from '@testing-library/react';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      aboutView: false,
      trackerView: false,
      weatherView: true,
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView = (eventKey) => {
    if (eventKey === '1') {
      this.setState({
        aboutView: true,
        trackerView: false,
        weatherView: false
      });
    }
    else if (eventKey === '2') {
      this.setState({
        aboutView: false,
        trackerView: true,
        weatherView: false
      });
    }
    else if (eventKey === '3') {
      this.setState({
        aboutView: false,
        trackerView: false,
        weatherView: true
      });
    }
  }
 
  render() {
    return (
      <div>
        <MainSideBar changeView={this.changeView}/>
        <AboutView displayed={this.state.aboutView}/>
        <TrackerView displayed={this.state.trackerView}/>
        <WeatherView displayed={this.state.weatherView}/>
      </div>
    );
  }
}

export default App;
