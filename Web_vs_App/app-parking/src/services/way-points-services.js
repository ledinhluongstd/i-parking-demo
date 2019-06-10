import axios from 'axios';
import { API } from '../common/constants.js';
function getWayPoints(from, to) {
    return axios.get(`${API.WAY_POINTS}${'?from='}${from}${'&to='}${to}`)
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

export { getWayPoints }