import React, { Component } from 'react';
import './styles.scss'
import Map from '../Map'
import List from '../List'
// import { getAllEntities } from '../../services/entities-services'
// import { getAllParkingSpot } from '../../services/parking-spot-services'
import { getAllStreetParking } from '../../services/street-parking-services'
import { getAllMitcIotDevices } from '../../services/mitc-iot-devices'
// import { StreetParking, ParkingSpot } from './dataFake'
import axios from 'axios'
import socketIOClient from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.min.css';
import { getWayPoints } from '../../services/way-points-services';
import ReactDOM from 'react-dom';
import Direct from '../Direct';

let carFree = require('../../assets/icon/free.png')
let carBusy = require('../../assets/icon/busy.png')
let wifi = require('../../assets/icon/wifi.png')
const DEFAULT_LAT = 20.992458
const DEFAULT_LNG = 105.835876
let checkNull = (str) => {
    return !!str.replace(/\s/g, '').length
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            streetParking: [],
            parkingSpot: [],
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
            wayPointsStep: {},
            from: {},
            to: {},
            reservationsIndex: -1
        }
        this.socket = socketIOClient('localhost:3005');

        this.getLocation = this.getLocation.bind(this)
        this.setPosition = this.setPosition.bind(this)
        this.initData = this.initData.bind(this)

    }
    async    componentWillMount() {
        let reservationsIndex= localStorage.getItem("reservationsIndex")
        console.log(reservationsIndex)
        if(reservationsIndex === null){
            this.state.reservationsIndex = -1
        }else{
            this.state.reservationsIndex = reservationsIndex
        }
        this.forceUpdate()
        this.getLocation()
        this.initData()
    }


    componentDidMount() {
        this.socket.emit('app_parking')
        this.socket.on('notification', (notification) => {
            // console.log('notification', 'componentDidMount', JSON.stringify(notification))
            let checkCarIn = checkNull(notification.data[0].rfid_vehiche.value)
            let carId = notification.data[0].rfid_vehiche.value
            let parkingSpot = notification.data[0].parkingspot.value
            let streetParking = notification.data[0].refStreetParking.value === 'urn:entity:santander:parking:onStreet:StaLuciaEast' ? "Bãi đỗ xe 1" : "Bãi đỗ xe 2"
            let parkingSpotName = parkingSpot.split(":")[parkingSpot.split(":").length - 1]
            // console.log(parkingSpot.split(":").length)
            if (checkCarIn) {
                let textNotify = "Xe số " + carId + " đã vào " + streetParking + " tại vị trí " + parkingSpotName
                toast(textNotify)
            } else {
                let textNotify = "Vị trí " + parkingSpotName + " tại " + streetParking + " đã trống"
                toast(textNotify)

            }
            this.initData()
        })
    }
    componentDidUpdate(prevProps) {

    }

    async initData() {
        console.log('initData')
        let streetParking = [], parkingSpot = []
        let apiRequest = [getAllStreetParking(), getAllMitcIotDevices()]
        let apiResponse = await axios.all(apiRequest).then(axios.spread(function (streetParking, mitcIotDevices) {
            return {
                streetParking: streetParking,
                mitcIotDevices: mitcIotDevices
            }
        }));
        // console.log(apiResponse.mitcIotDevices)
        // streetParking = this.convertStreetParking(apiResponse.streetParking)
        // mitcIotDevices = this.convertMitcIotDevices(apiResponse.mitcIotDevices)
        streetParking = this.convertStreetParkingVsMitcIotDevices(apiResponse.streetParking, apiResponse.mitcIotDevices)[0]
        parkingSpot = this.convertStreetParkingVsMitcIotDevices(apiResponse.streetParking, apiResponse.mitcIotDevices)[1]
        // giả sử gọi thành công
        // console.log(JSON.stringify(streetParking))
        this.setState({ streetParking, parkingSpot })
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition);
        } else {
            alert("Định vị địa lý không được hỗ trợ bởi trình duyệt này.")
        }
    }

    setPosition(position) {
        this.state.latLng.lat = 20.992458//position.coords.latitude
        this.state.latLng.lng = 105.835876//position.coords.longitude

        this.state.mapCenter.lat = 20.992458//position.coords.latitude
        this.state.mapCenter.lng = 105.835876//position.coords.longitude

        this.state.mapMarker.lat = 20.992458//position.coords.latitude
        this.state.mapMarker.lng = 105.835876//position.coords.longitude

        this.forceUpdate()
    }
    convertStreetParkingVsMitcIotDevices(streetParking, mitcIotDevices) {
        let dataReturn = []
        let parkingSpot = []
        streetParking.map(parking => {

            let x1 = parking.location.value.coordinates[0][0]
            let y1 = parking.location.value.coordinates[0][1]
            let x2 = parking.location.value.coordinates[1][0]
            let y2 = parking.location.value.coordinates[1][1]

            let check = Math.abs(x2 - x1) < Math.abs(y2 - y1)

            parking.bounds = [{
                north: x1,
                south: check ? (x2 - x1) / 2 + x1 + 0.00001 : x2,
                east: y2,
                west: check ? y1 : (y2 - y1) / 2 + y1 + 0.00001
            },
            {
                north: check ? (x2 - x1) / 2 + x1 - 0.00001 : x1,
                south: x2,
                east: check ? y2 : (y2 - y1) / 2 + y1 - 0.00001,
                west: y1
            },
            {
                north: x1,
                south: x2,
                east: y2,
                west: y1
            }]

            parking.latLongChild = []

            parking.totalSpot = 0
            parking.availableSpot = 0
            parking.notAvailableSpot = 0
            parking.parkingSpot = []
            parking.address = parking.name.value
            parking.hour = parking.price.value.find(o => o.key === 'Hour').value;
            parking.day = parking.price.value.find(o => o.key === 'Day').value
            parking.night = parking.price.value.find(o => o.key === 'Night').value

            mitcIotDevices.map(device => {
                if (checkNull(device.rfid_vehiche.value.trim())) device.availableSpot = false;
                if (parking.id === device.refStreetParking.value) {
                    parking.parkingSpot.push(device)
                    parking.totalSpot++

                    if (checkNull(device.rfid_vehiche.value.trim())) {
                        parking.notAvailableSpot++
                    }
                }
                // console.log(parking.totalSpot)
                // for (let i = 1; i <= parking.totalSpot; i++) {
                //     let lat, lng, k;
                //     if ((i) % 2 === 0) {
                //         k = Math.floor((i - 1) / 2) + Math.floor((i) / 2)
                //         // console.log(k)
                //     }
                //     lat = ((i % 2 === 0 ? 1 : 3) * (x2 - x1) / 4 + x1).toFixed(6);
                //     lng = y1 - k * (y1 - y2) / parking.totalSpot
                //     let temp = {
                //         lat: parseFloat(lat),
                //         lng: lng,
                //         //icon: carFree
                //     }
                //     parkingSpot.push(temp)
                // }
            })

            for (let i = 1; i <= parking.totalSpot; i++) {
                let lat, lng, k = 1, deviceTemp = parking.parkingSpot[i - 1];
                console.log(deviceTemp)

                if ((i) % 2 === 0) {
                    k = Math.floor((i - 1) / 2) + Math.floor((i) / 2)
                    // console.log(k)
                } else {
                    k = Math.floor((i + 1) / 2) + Math.floor((i) / 2)
                }
                // lat = ((i % 2 === 0 ? 1 : 3) * (x2 - x1) / 4 + x1).toFixed(6);
                // lng = y1 - k * (y1 - y2) / parking.totalSpot

                lat = (x1 - k * (x1 - x2) / parking.totalSpot).toFixed(6) - 0.00005
                lng = ((i % 2 === 0 ? 1 : 3) * (y2 - y1) / 4 + y1).toFixed(6);
                let tempCar = {
                    lat: parseFloat(lat) + 0.00003,
                    lng: parseFloat(lng),
                    icon: checkNull(deviceTemp.rfid_vehiche.value) ? carBusy : 'undefined',//carFree,
                    label: checkNull(deviceTemp.rfid_vehiche.value) ? deviceTemp.rfid_vehiche.value : "Vị trí trống",
                    show: false, //checkNull(deviceTemp.rfid_vehiche.value) ? true : false
                    toleranceX: (x2 - x1) / parking.totalSpot,
                    toleranceY: (y2 - y1) / 4 - 0.00001,
                    polX: parseFloat(lat) + 0.00005,
                    polY: parseFloat(lng),
                    type: "LINE",
                    line: !!((i) !== 1 && (i) !== 2)
                }
                let tempWifi = {
                    lat: parseFloat(lat) - (x2 - x1) / parking.totalSpot,
                    lng: parseFloat(lng) - (y2 - y1) / 4 + 0.00003,
                    icon: wifi,
                    label: deviceTemp.id,
                    show: false//checkNull(deviceTemp.rfid_vehiche.value) ? true : false
                }
                let tempRfid = {
                    lat: parseFloat(lat),//- 0.00001,
                    lng: parseFloat(lng),
                    icon: 'undefined', //checkNull(deviceTemp.rfid_vehiche.value) ? carBusy : carFree,
                    label: checkNull(deviceTemp.rfid_vehiche.value) ? deviceTemp.rfid_vehiche.value : "Vị trí trống",
                    show: checkNull(deviceTemp.rfid_vehiche.value) ? true : false
                }
                parkingSpot.push(tempCar)
                parkingSpot.push(tempWifi)
                parkingSpot.push(tempRfid)
            }
            dataReturn.push(parking)
        })
        return [dataReturn, parkingSpot]
    }
    convertStreetParking(data) {
        if (!data) return []
        let dataReturn = []
        data.map(item => {

            let x1, y1, x2, y2
            x1 = item.location.value.coordinates[0][0]
            y1 = item.location.value.coordinates[0][1]
            x2 = item.location.value.coordinates[1][0]
            y2 = item.location.value.coordinates[1][1]

            let check = Math.abs(x2 - x1) < Math.abs(y2 - y1)

            item.bounds = [{
                north: x1,
                south: check ? (x2 - x1) / 2 + x1 + 0.00001 : x2,
                east: y2,
                west: check ? y1 : (y2 - y1) / 2 + y1 + 0.00001
            },
            {
                north: check ? (x2 - x1) / 2 + x1 - 0.00001 : x1,
                south: x2,
                east: check ? y2 : (y2 - y1) / 2 + y1 - 0.00001,
                west: y1
            },
            {
                north: x1,
                south: x2,
                east: y2,
                west: y1
            }]
            item.icon = carFree
            dataReturn.push(item)
        })
        return dataReturn
    }
    convertMitcIotDevices(data) {
        if (!data) return
        let dataReturn = []
        data.map(item => {
            item.position = { lat: item.location.value.coordinates[0], lng: item.location.value.coordinates[1] }
            dataReturn.push(item)
        })
        return dataReturn
    }

    onMyLocationClick() {
        this.state.mapCenter = JSON.parse(JSON.stringify(this.state.latLng))
        // this.state.from = JSON.parse(JSON.stringify(this.state.latLng))
        // this.state.to =JSON.parse(JSON.stringify(this.state.latLng))
        this.forceUpdate()
    }
    async onDirectParkingClick(item, index) {
        this.state.mapCenter = {
            lat: item.location.value.coordinates[0][0],
            lng: item.location.value.coordinates[0][1]
        }
        this.state.from = JSON.parse(JSON.stringify(this.state.latLng))
        this.state.to = JSON.parse(JSON.stringify(this.state.mapCenter))
        let from = this.state.from.lat + ',' + this.state.from.lng
        let to = this.state.to.lat + ',' + this.state.to.lng

        let wayPoints = await getWayPoints(from, to)
        this.state.wayPointsStep = this.convertWayPoints(wayPoints)
        // console.log(wayPoints)

        this.closeNav()
        this.forceUpdate()
    }
    convertWayPoints(wayPoints) {
        console.log(wayPoints)
        if (!wayPoints) return []
        if (wayPoints.status === 'NOT_FOUND') return []
        let wayPointsReturn = {
            distance: wayPoints.routes[0].legs[0].distance.text,
            duration: wayPoints.routes[0].legs[0].duration.text,
            steps: [],
            start_address: wayPoints.routes[0].legs[0].start_address,
            end_address: wayPoints.routes[0].legs[0].end_address
        }
        wayPoints.routes[0].legs[0].steps.map(item => {
            item.html_instructions += '<br/>'
            wayPointsReturn.steps.push(item.html_instructions)
        })
        return wayPointsReturn
    }
    onParkingClick(item, index) {
        this.state.mapCenter = {
            lat: item.location.value.coordinates[0][0],
            lng: item.location.value.coordinates[0][1]
        }
        this.closeNav()
        this.forceUpdate()
    }
    openNav() {
        let mySidenav = ReactDOM.findDOMNode(this.refs.sidepanel);
        console.log(mySidenav)
        mySidenav.style.width = "70%"
    }
    closeNav() {
        let mySidenav = ReactDOM.findDOMNode(this.refs.sidepanel);
        console.log(mySidenav)
        mySidenav.style.width = "0"
    }
    reservations(index) {
        if (this.state.reservationsIndex === index) {
            this.state.reservationsIndex = -1
        } else {
            this.state.reservationsIndex = index
        }
        localStorage.setItem("reservationsIndex", index)
        this.forceUpdate()
    }
    render() {
        return (
            <div className="row justify-content-center">
                <div className="home col-md-4 col-md-offset-4">
                    <div className="body">

                        <button className="openbtn" onClick={() => this.openNav()}>&#9776; BÃI ĐỖ XE THÔNG MINH</button>

                        {/* <div className="top col-xs-12 sidepanel"> */}
                        <div ref="sidepanel" className="sidepanel">
                            <List
                                reservations={this.reservations.bind(this)}
                                reservationsIndex={this.state.reservationsIndex}
                                closeNav={this.closeNav.bind(this)}
                                wayPointsStep={this.state.wayPointsStep}
                                streetParking={this.state.streetParking}
                                onDirectParkingClick={this.onDirectParkingClick.bind(this)}
                                onParkingClick={this.onParkingClick.bind(this)}
                                onMyLocationClick={this.onMyLocationClick.bind(this)} />
                        </div>
                        <Direct wayPointsStep={this.state.wayPointsStep}
                        />
                        <div className="bottom col-xs-12">
                            <Map
                                streetParking={this.state.streetParking}
                                parkingSpot={this.state.parkingSpot}
                                // zoom={this.state.zoom}
                                mapCenter={this.state.mapCenter}
                                mapMarker={this.state.mapMarker}

                                from={this.state.from}
                                to={this.state.to}
                            />
                        </div>
                    </div>


                    {/* <div className="header text-center">
                    <h4>ỨNG DỤNG DI ĐỘNG BÃI ĐỖ XE THÔNG MINH</h4>
                </div>
                <div className="body row">
                    <div className="left col-md-3">
                        <List
                            wayPointsStep={this.state.wayPointsStep}
                            streetParking={this.state.streetParking}
                            onDirectParkingClick={this.onDirectParkingClick.bind(this)}
                            onParkingClick={this.onParkingClick.bind(this)}
                            onMyLocationClick={this.onMyLocationClick.bind(this)} />
                    </div>
                    <div className="right col-md-9">
                        <Map
                            streetParking={this.state.streetParking}
                            parkingSpot={this.state.parkingSpot}
                            // zoom={this.state.zoom}
                            mapCenter={this.state.mapCenter}
                            mapMarker={this.state.mapMarker}

                            from={this.state.from}
                            to={this.state.to}
                        />
                    </div>
                </div> */}
                    <ToastContainer />
                </div>
            </div>
        )
    }
}
export default Home