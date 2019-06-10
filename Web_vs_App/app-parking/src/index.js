import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios'
if (!String.prototype.format) { // define format of string
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : ''
                ;
        });
    };
}

axios.interceptors.request.use(function (config) {
    config.headers['fiware-service'] = 'mitc';
    config.headers['fiware-servicepath'] = '/'
    config.headers['options'] = 'keyValues';
    config.timeout = 20000;
    return config;
}, function (error) {
    return Promise.reject(error);
})

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
