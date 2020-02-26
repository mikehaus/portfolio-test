import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
 
const MAP_STYLES = {
    display: 'block',
    width: '90%',
    height: '40%',
    top: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
};


class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            maplat: 40.2338,
            maplng: -111.658531,
            markerlat: 40.2338,
            markerlng: -111.658531
        };
        this.moveMarkerToClicked = this.moveMarkerToClicked.bind(this);
    }

    componentWillMount = () => {
        console.log('weather view mounting...');
    }
    
    componentDidMount = () => {
    }

    moveMarkerToClicked = (ref, map, e) => {
        let lat = e.latLng.lat();
        let lng  = e.latLng.lng();

        this.setState({
            maplat: lat,
            maplng: lng,
            markerlat: lat,
            markerlng: lng
        });
    }

    render() { 
        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={MAP_STYLES}
                initialCenter={{
                lat: this.state.maplat,
                lng: this.state.maplng
                }}
                onClick={this.moveMarkerToClicked}
            >
                <Marker 
                    position={{lat: this.state.markerlat, lng: this.state.markerlng}}
                    draggable
                />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC8Sh21qfWtqPMuk_C5Z5P9Rnwk3Unc-Io'
  })(MapContainer);