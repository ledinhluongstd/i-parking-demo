import React, { Component } from 'react';
import axios from 'axios'
import './styles.scss'
import { getWayPoints } from '../../services/way-points-services';
import renderHTML from 'react-render-html';
import ReactDOM from 'react-dom';

class Direct extends Component {
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
    // onParkingClick(item, index) {
    //     this.props.onParkingClick(item, index)
    // }
    // async onDirectItemClick(item, index) {
    //     this.props.onDirectParkingClick(item, index)
    // }
    // myLocationClick() {
    //     this.props.onMyLocationClick()
    // }
    // closeNav() {
    //     this.props.closeNav()

    // }
    render() {
        let { wayPointsStep } = this.props
        if(!wayPointsStep.steps || this.props.wayPointsStep.steps.length === 0){
            return null
        }
        return (
            <div className="top col-xs-12">
            <div className="direct-body">
                {this.props.wayPointsStep.steps && this.props.wayPointsStep.steps.length !== 0 ? <div className="direct">
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
                        return <li key={index}> {renderHTML(item)}</li>
                    })}
                </div> : null}
            </div>
            </div>
        )
    }
}
export default Direct