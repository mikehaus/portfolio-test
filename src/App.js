import React from 'react';
import TrackerView from './components/tracker/tracker';
import MainSideBar from './components/mainsidebar';
import AboutView from './components/about';
import WeatherView from './components/weather/weatherview';
import TimerView from './components/timer/timer';
import firebase from './firebase';

import './App.css';
import 'rsuite/dist/styles/rsuite-dark.css'
import { render } from '@testing-library/react';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      aboutView: false,
      trackerView: false,
      weatherView: false,
      timerView: true,
      db: null,
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView = (eventKey) => {
    // may implement with switch, but for now if/else if
    if (eventKey === '1') {
      this.setState({
        aboutView: true,
        trackerView: false,
        weatherView: false,
        timerView: false
      });
    }
    else if (eventKey === '2') {
      this.setState({
        aboutView: false,
        trackerView: true,
        weatherView: false,
        timerView: false
      });
    }
    else if (eventKey === '3') {
      this.setState({
        aboutView: false,
        trackerView: false,
        weatherView: true,
        timerView: false
      });
    }
    else if (eventKey === '4') {
      this.setState({
        aboutView: false,
        trackerView: false,
        weatherView: false,
        timerView: true
      })
    }
  }

  componentWillMount = () => {
    this.setState({
      db: firebase.database()
    });
  }
 
  render() {
    return (
      <div>
        <MainSideBar changeView={this.changeView}/>
        <AboutView displayed={this.state.aboutView}/>
        <TrackerView db={this.state.db} displayed={this.state.trackerView}/>
        <WeatherView displayed={this.state.weatherView}/>
        <TimerView displayed={this.state.timerView}/>
      </div>
    );
  }
}

export default App;
