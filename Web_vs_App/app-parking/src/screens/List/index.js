import React, { Component } from 'react';
import axios from 'axios'
import './styles.scss'
import { getWayPoints } from '../../services/way-points-services';
import renderHTML from 'react-render-html';
import ReactDOM from 'react-dom';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entities: []
        }
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentDidUpdate() {

    }
    onParkingClick(item, index) {
        this.props.onParkingClick(item, index)
    }
    async onDirectItemClick(item, index) {
        this.props.onDirectParkingClick(item, index)
    }
    myLocationClick() {
        this.props.onMyLocationClick()
    }
    closeNav() {
        this.props.closeNav()

    }
    reservations(index) {
        this.props.reservations(index)
    }
    render() {
        let { streetParking, reservationsIndex } = this.props
        // console.log(reservationsIndex)
        return (
            <div className="list">
                <a className="closebtn" onClick={() => this.closeNav()}>&times;</a>
                <div className="item text-center" onClick={() => this.myLocationClick()}>
                    <strong> {"Vị trí của tôi"}</strong>
                </div>
                {streetParking.map((item, index) => {
                    let name = item.id
                    let availableSpotNumber = item.totalSpot - item.notAvailableSpot
                    let totalSpotNumber = item.totalSpot
                    let parking = "Bãi đỗ xe: " + (index + 1) // + `${' - (Chỗ trống: '}${availableSpotNumber}${'/'}${totalSpotNumber}${')'}`
                    let reservations = reservationsIndex !== index ? "Đặt chỗ" : "Hủy đặt chỗ"
                    return (
                        // <div className="item" style={{ color: index === 0 ? "#FF0000" : "#00008B" }} key={index} onClick={() => this.onParkingClick(item, index)} >
                        <div className="item" style={{ color: "#ffffff" }} key={index} >
                            <div className="col-xs-12">
                                <span > <strong onClick={() => this.onParkingClick(item, index)} > {parking}</strong>&nbsp;&nbsp;<i className="fa fa-arrow-circle-o-right" title="Chỉ đường" onClick={() => this.onDirectItemClick(item, index)}></i>
                                </span>
                                <span className="pull-right" onClick={() => this.reservations(index)}>{reservations}</span>
                            </div>
                            {"- Địa chỉ: " + item.address}<br />
                            {"- Chỗ trống: " + availableSpotNumber + '/' + totalSpotNumber}<br />
                            {"- Vé giờ: " + item.hour + " đồng"}<br />
                            {"- Vé ngày: " + item.day + " đồng"}<br />
                            {"- Vé đêm: " + item.night + " đồng"}<br />

                        </div>
                    )
                })}
                {/* {this.props.wayPointsStep.steps && this.props.wayPointsStep.steps.length !== 0 ? <div className="direct">
                    <div className="info item text-left">
                        <a data-toggle="collapse" href="#" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">
                            <strong>{"Thông tin lộ trình"}</strong>
                        </a>
                        <div className="" id="multiCollapseExample1">
                            <li>{"Phương tiện: "}{"Ô tô "}<i className="fa fa-car" aria-hidden="true"></i></li>
                            <li>{"Điểm khởi hành: "}{this.props.wayPointsStep.start_address}</li>
                            <li>{"Điểm kết thúc: "}{this.props.wayPointsStep.end_address}</li>
                            <li>{"Thời gian: "}{this.props.wayPointsStep.duration}</li>
                            <li>{"Quãng đường: "}{this.props.wayPointsStep.distance}</li>
                        </div>
                    </div>
                    <div className="item text-left">
                        <a data-toggle="collapse" href="#" role="button" aria-expanded="false" aria-controls="multiCollapseExample2">
                            <strong>{"Lộ trình chi tiết"}</strong>
                        </a>
                    </div>
                    {this.props.wayPointsStep.steps.map((item, index) => {
                        return <li key={index} style={{color: "#ffffff"}}> {renderHTML(item)}</li>
                    })}
                </div> : null} */}
                {/* {this.props.wayPointsStep.length !== 0 ? <div className="item text-left">
                    <strong>{"Lộ trình chi tiết"}</strong>
                </div> : null}
                {this.props.wayPointsStep.map(item => {
                    return renderHTML(item)
                })} */}
            </div>
        )
    }
}
export default List