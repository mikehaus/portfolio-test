import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
 
const MAP_STYLES = {
    width: 800,
    height: 500,
};


class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            lat: '',
            long: ''
        };
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.logLatLong = this.logLatLong.bind(this);
    }

    logLatLong = () => {
        console.log('Latitude: ', this.state.lat);
        console.log('Longitude: ', this.state.long);
    }


    getCurrentLocation = () => {
        let latstr, longstr;

        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            
            console.log(lat, long);

            latstr = lat.toString();
            longstr = long.toString();
        });

        // Not sure if the state was acutally set
        this.setState({
            lat: latstr,
            long: longstr
        });

        console.log(latstr, longstr);
    }

    componentWillMount = () => {
        console.log('weather view mounting...');
    }
    
    componentDidMount = () => {
        this.getCurrentLocation();
    }

    render() { 
        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={MAP_STYLES}
                initialCenter={{
                lat: -1.2884,
                lng: 36.8233
                }}
            />
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC8Sh21qfWtqPMuk_C5Z5P9Rnwk3Unc-Io'
  })(MapContainer);