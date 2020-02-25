import React from 'react';
import GoogleApiWrapper from './mapcomponent';
import { FlexboxGrid, Col } from 'rsuite';
 
const WEATHER_STYLES = {
    main: {
        width: '95vw',
        height: '90vh',
        overflowY: 'auto',
        overflowX: 'none',
        position: 'absolute',
        left: '65px',
        right: '50px',
        top: '10px',
        bottom: '10px',
        padding: '10px',
    },
    flexbox: {
        position: 'relative',
        textAlign: 'center',
        margin: 50,
        left: 10,
        right: 10,
        height: '50vh',
    }
}

class WeatherView extends React.Component {
    render() { 
        if (!this.props.displayed) {
            return null;
        }

        return (
            <div style={WEATHER_STYLES.main}>
                <h1>Weather View</h1>
                <FlexboxGrid justify="space-around" style={WEATHER_STYLES.flexbox}>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={6}>
                        <GoogleApiWrapper />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={6}>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}
 
export default WeatherView;