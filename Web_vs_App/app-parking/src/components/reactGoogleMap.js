/*global google*/
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import { compose, withProps, lifecycle } from 'recompose';
import { Rectangle, Polygon } from "react-google-maps"

const GOOGLE_API_KEY = 'AIzaSyBu30P9_exh4RWvpFRB9csk9vePkkH-Csc'
const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?libraries=places&key='
const carRed = require('../assets/icon/busy.png')
const carBlue = require('../assets/icon/free.png')

const GoogleMapsComponent = compose(
    withProps({
        googleMapURL: `${GOOGLE_MAPS_URL}${GOOGLE_API_KEY}`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div className="map-wrapper" style={{ height: '70vh' }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidUpdate(prevProps) {
            let { from, to } = this.props
            if (from !== prevProps.from || to !== prevProps.to) {
                const DirectionsService = new google.maps.DirectionsService();
                DirectionsService.route({
                    origin: new google.maps.LatLng(from.lat, from.lng),
                    destination: new google.maps.LatLng(to.lat, to.lng),
                    travelMode: google.maps.TravelMode.DRIVING,
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        this.setState({
                            directions: result,
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                });
            }
        },

        componentDidMount() {

        }
    })
)((props) =>
    <GoogleMap
        zoom={20}
        center={props.center}
        onIdle={props.onMapLoad}
        onClick={props.onClick}
        disableDefaultUI={true}
        options={{}}
    //onZoomChanged={() => console.log(GoogleMap.getZoom())}
    >
        <DirectionsRenderer directions={props.directions}
        />
        <Marker position={props.marker}
            draggable={false}
            // icon={require('../assets/icon/busy.png')}
            label={"Vị trí của tôi"}
            opacity={0.8}
            onDragEnd={props.markerChanged} />

        {props.streetParking && props.streetParking.map((item, index) => {
            const options = {
                strokeColor: index === 0 ? '#FF0000' : '#00008B',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#ffffff',//index === 0 ? '#FF0000' : '#00008B',
                // fillOpacity: 0.35,
            }
            const name = item.id
            const availableSpotNumber = item.totalSpot - item.notAvailableSpot
            const totalSpotNumber = item.totalSpot

            // const alertText = `${name} ${'(Trống: '}${availableSpotNumber}${'/'}${totalSpotNumber}${')'}`
            let parking = "Bãi đỗ xe: " + (index + 1) + `${' - (Chỗ trống: '}${availableSpotNumber}${'/'}${totalSpotNumber}${')'}`

            return <div key={index}>
                <Rectangle
                    // onClick={() => console.log(1)}
                    options={options}
                    bounds={item.bounds[0]}
                />
                <Rectangle
                    // onClick={() => console.log(1)}
                    options={options}
                    bounds={item.bounds[1]}
                />
                <Rectangle
                    onClick={() => alert(parking)}
                    options={options}
                    bounds={item.bounds[2]}
                />
            </div>
        })}

        {/* {props.streetParking && props.streetParking.map((item, index) => {
            const name = item.id
            const availableSpotNumber = item.totalSpot - item.notAvailableSpot
            const totalSpotNumber = item.totalSpot
            const markerText = `${name} ${'(Trống: '}${availableSpotNumber}${'/'}${totalSpotNumber}${')'}`
            return <Marker
                position={item.position}
                draggable={false}
                icon={null}
                label={markerText}

                key={index} />
        })} */}

        {props.parkingSpot && props.parkingSpot.map((item, index) => {
            return <Marker
                onClick={() => alert(item.label)}
                position={item}
                icon={item.icon}
                draggable={false}
                label={item.show ? item.label : null}
                key={index} >
            </Marker>
        })}

        {props.parkingSpot && props.parkingSpot.map((item, index) => {
            if (item.type === "LINE" && item.line)
                return <Polygon
                    options={{ strokeColor: '#000000', strokeWeight: 1 }}
                    paths={[{ lat: item.polX - item.toleranceX, lng: item.polY - item.toleranceY },
                    { lat: item.polX - item.toleranceX, lng: item.polY + item.toleranceY }]}
                    key={index} />

        })}


    </GoogleMap>
);

export default GoogleMapsComponent;