import React, { Component } from 'react';
import './styles.scss'
// import { GoogleMap, Marker } from "react-google-maps"
// import ReactGoogleMapLoader from "react-google-maps-loader"
// import ReactGoogleMap from "react-google-map"
import GoogleMapsComponent from '../../components/reactGoogleMap'
// import { Rectangle } from "react-google-maps"

const DEFAULT_LAT = 0
const DEFAULT_LNG = 0
const DEFAULT_ZOOM = 18

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latLng: {
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG
            },
            mapCenter: {
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG
            },
            mapMarker: {
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG
            },
            zoom: DEFAULT_ZOOM,
        }
        this.getLocation = this.getLocation.bind(this)
        this.setPosition = this.setPosition.bind(this)
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        let { data } = this.props
        if (data !== prevProps.data) {

        }
    }
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition);
        } else {

        }
    }
    setPosition(position) {

        this.state.latLng.lat = position.coords.latitude
        this.state.latLng.lng = position.coords.longitude

        this.state.mapCenter.lat = position.coords.latitude
        this.state.mapCenter.lng = position.coords.longitude

        this.state.mapMarker.lat = position.coords.latitude
        this.state.mapMarker.lng = position.coords.longitude
        this.forceUpdate()
    }
    initRectangle(data) {
       
    }
    render() {
        // let { data } = this.props
        return (
            <div className="google-map" id="google-map">
                <GoogleMapsComponent
                    center={this.props.mapCenter}
                    marker={this.props.mapMarker}

                    streetParking={this.props.streetParking}
                    parkingSpot={this.props.parkingSpot}

                    from={this.props.from}
                    to={this.props.to}
                />
            </div>
        )
    }
}
export default Map