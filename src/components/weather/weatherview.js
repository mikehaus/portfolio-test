import React from 'react';
import GoogleApiWrapper from './mapcomponent';
import { FlexboxGrid, Col, Table } from 'rsuite';
 
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

const { Column, HeaderCell, Cell, Pagination } = Table;


class WeatherView extends React.Component {

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