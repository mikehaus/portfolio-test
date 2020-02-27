import React from 'react';
import GoogleApiWrapper from './mapcomponent';
import ReactWeather from 'react-open-weather';
import apiKeys from '../../data/apikeys';
import { FlexboxGrid, Col, Table } from 'rsuite';

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

let fakeLargeData = [
    {loc: 'hello'},
]

let myWeather = {
    loc: '',
    temp: '',
    humidity: '',
    sunrise: '',
    sunset: '',
    windSp: '',
    windDir: ''
};

class WeatherView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            weatherData: null,
            loc: '',
            temp: '',
            humidity: '',

        }
        this.logData = this.logData.bind(this);
        this.setMyWeather = this.setMyWeather.bind(this);
    }

    setMyWeather(loc, temp, humidity, sunrise, sunset, windSp, windDir) {
        myWeather.loc = loc;
        myWeather.temp = temp;
        myWeather.humidity = humidity;
        myWeather.sunrise = sunrise;
        myWeather.sunset = sunset;
        myWeather.windSp = windSp;
        myWeather.windDir = windDir;
    }

    componentDidMount() {
        fetch("http://api.openweathermap.org/data/2.5/weather?lat=40.2338&lon=-111.658531&appid=c537f3f0ebe8427aa0a4dd154b7a217b")
            .then(res => res.json())
            .then(
                (weatherData) => {
                this.setState({
                    isLoaded: true,
                    weatherData: weatherData,
                    loc: weatherData.name
                });
                }  
            )
    }

    logData = () => {
        console.log(this.state.weatherData);
        console.log(this.state.isLoaded);
        console.log(this.state.loc);
    }

    render() { 
        if (!this.props.displayed) {
            return null;
        }

        return (
            <div style={WEATHER_STYLES.main} onClick={this.logData}>
                <h1>Weather View</h1>
                    <GoogleApiWrapper />
                    <div style={WEATHER_STYLES.table}>
                        
                    <Table
                        virtualized
                        height={200}
                        data={this.state.weatherItems}
                        onRowClick={data => {
                            console.log(data);
                        }}
                        >
                            <Column width={150} align="center" fixed>
                                <HeaderCell>Location</HeaderCell>
                                <Cell dataKey='loc' />
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