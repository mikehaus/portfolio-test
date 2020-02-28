import React from 'react';
import GoogleApiWrapper from './mapcomponent';
import apiKeys from '../../data/apikeys';
import { Table } from 'rsuite';

import 'react-open-weather/lib/css/ReactWeather.css';
 
const WEATHER_STYLES = {
    main: {
        width: '95vw',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'none',
        position: 'absolute',
        left: 65,
        right: 50,
        top: 10,
        bottom: 10,
        padding: 10,
    },
    table: {
        position: 'relative',
        top: '50%',
        width: '70%',
        height: '10%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
}

const { Column, HeaderCell, Cell } = Table;

class WeatherView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            //loc: '',
            //temp: '',
            //humidity: '',
            //sunrise: '',
            //sunset: '',
            //windSp: '',
            //windDir: '',
            weatherData: [
                {loc: ''},
                {temp: ''},
                {humidity: ''},
                {sunrise: ''},
                {sunset: ''},
                {temp: ''},
                {windSp: ''},
                {windDir: ''}
            ]
        }
    }

    componentDidMount() {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=40.2338&lon=-111.658531&appid=${apiKeys.weather}&units=imperial`)
            .then(res => res.json())
            .then(
                (weatherData) => {
                this.setState({
                    isLoaded: true,
                    //loc: weatherData.name,
                    //temp: weatherData.main.temp,
                    //humidity: weatherData.main.humidity,
                    //sunrise: weatherData.sys.sunrise,
                    //sunset: weatherData.sys.sunset,
                    //windSp: weatherData.wind.speed,
                    //windDir: weatherData.wind.deg,
                    weatherData: [
                        { 
                            loc: weatherData.name,
                            temp: weatherData.main.temp,
                            humidity: weatherData.main.humidity,
                            sunrise: weatherData.sys.sunrise,
                            sunset: weatherData.sys.sunset,
                            windSp: weatherData.wind.speed,
                            windDir: weatherData.wind.deg
                        },
                    ]
                });
                }  
            )
    }

    updateTable = (lat, lng) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKeys.weather}&units=imperial`)
            .then(res => res.json())
            .then(
                (weatherData) => {
                this.setState({
                    isLoaded: true,
                    //loc: weatherData.name,
                    //temp: weatherData.main.temp,
                    //humidity: weatherData.main.humidity,
                    //sunrise: weatherData.sys.sunrise,
                    //sunset: weatherData.sys.sunset,
                    //windSp: weatherData.wind.speed,
                    //windDir: weatherData.wind.deg,
                    weatherData: [
                        { 
                            loc: weatherData.name,
                            temp: weatherData.main.temp,
                            humidity: weatherData.main.humidity,
                            sunrise: weatherData.sys.sunrise,
                            sunset: weatherData.sys.sunset,
                            windSp: weatherData.wind.speed,
                            windDir: weatherData.wind.deg
                        },
                    ]
                });
                }  
            )
    }

    render() { 
        if (!this.props.displayed) {
            return null;
        }

        return (
            <div style={WEATHER_STYLES.main}>
                <h1>Weather View</h1>
                    <GoogleApiWrapper updateTable={this.updateTable} />
                    <div style={WEATHER_STYLES.table}>
                        
                    <Table
                        virtualized
                        height={100}
                        data={this.state.weatherData}
                        >
                            <Column width={150} align="center" fixed>
                                <HeaderCell>Location</HeaderCell>
                                <Cell dataKey="loc" />
                            </Column>

                            <Column width={150}>
                                <HeaderCell>Temperature</HeaderCell>
                                <Cell dataKey="temp" />
                            </Column>

                            <Column width={150}>
                                <HeaderCell>Humidity</HeaderCell>
                                <Cell dataKey="humidity" />
                            </Column>

                            <Column width={150}>
                                <HeaderCell>Sunrise</HeaderCell>
                                <Cell dataKey="sunrise" />
                            </Column>

                            <Column width={150}>
                                <HeaderCell>Sunset</HeaderCell>
                                <Cell dataKey="sunset" />
                            </Column>

                            <Column width={150}>
                                <HeaderCell>Wind Speed</HeaderCell>
                                <Cell dataKey="windSp" />
                            </Column>

                            <Column width={150}>
                                <HeaderCell>Wind Direction</HeaderCell>
                                <Cell dataKey="windDir" />
                            </Column>
                    </Table>
                    </div>
            </div>
        );
    }
}
 
export default WeatherView;