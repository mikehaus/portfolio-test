import React from 'react';
import GoogleApiWrapper from './mapcomponent';
import ReactWeather from 'react-open-weather';
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


class WeatherView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            weatherItems: '',
        }
    }

    componentDidMount() {
        fetch("api.openweathermap.org/data/2.5/forecast?lat=40.2338&lon=-111.658531&APPID=c537f3f0ebe8427aa0a4dd154b7a217b")
            .then(res => res.json())
            .then(
                (result) => {
                console.log(result.items);
                this.setState({
                    isLoaded: true,
                    weatherItems: result.items
                });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                this.setState({
                    isLoaded: true,
                    error
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
                    <GoogleApiWrapper />
                    <div style={WEATHER_STYLES.table}>
                    <Table
                        virtualized
                        height={200}
                        //data={fakeLargeData}
                        onRowClick={data => {
                            console.log(data);
                        }}
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