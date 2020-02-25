import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
 
const MAP_STYLES = {
    width: 800,
    height: 500,
};


class MapContainer extends React.Component {
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