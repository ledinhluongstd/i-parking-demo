import axios from 'axios';
import { API } from '../common/constants.js';
function getAllMitcIotDevices(params) {
    return axios.get(`${API.MITC_IOT_DEVICES}`)
        .then(res => {
            if (res.data) {
                return res.data;
            }
            else {
                return null
            }
        })
        .catch(error => {
            return false
        });
}

export { getAllMitcIotDevices }