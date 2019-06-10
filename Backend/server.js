const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const app = express();
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {    // console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
app.get('/', (req, res) => {// define a simple route
    res.json({ "message": "Welcome to EasyStudents application. Take Students quickly. Organize and keep track of all your Students." });
});

require('./app/routes/student.routes.js')(app);


const server = require("http").createServer(app);
var io = require("socket.io")(server);
let socketIO
io.on("connection", function (socket) {
    socketIO = socket
    socketIO.on('user_login_id', () => {

    })

});
app.post('/', (req, res) => {
    console.log(1111111111111111111111111111111111111111)
    // socketIO.emit("notification", req.body);
    res.send('Hello')
})

app.post('/mqtt', (req, res) => {
    // console.log(req.body.data)
    socketIO.emit("notification", req.body);
    res.send('Hello')
})
app.get('/mqtt', (req, res) => {
    socketIO.emit("notification");
    res.send('Hello')
})
app.put('/mqtt', (req, res) => {
    socketIO.emit("notification");
    res.send('Hello')
})
app.delete('/mqtt', (req, res) => {
    socketIO.emit("notification");
    res.send('Hello')
})

app.post('/iot', (req, res) => {
    console.log('/iot', req.body)
    res.status(200).send('OK')
    // res.send('Hello')
})
app.get('/iot', (req, res) => {
    console.log('/iot')
    res.send('Hello')
})
app.put('/iot', (req, res) => {
    console.log('/iot')
    res.send('Hello')
})
app.delete('/iot', (req, res) => {
    console.log('/iot')
    res.send('Hello')
})
app.patch('/iot', (req, res) => {
    console.log('/iot')
    res.send('Hello')
})


const config = {
    headers: {
        "fiware-service": "openiot",
        "fiware-servicepath": "/",
        "options": "keyValue"
    }
}
app.get('/way-points', async (req, res) => {
    // console.log(req.query)
    // res.send('Hello')
    let url = 'https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBu30P9_exh4RWvpFRB9csk9vePkkH-Csc&language=vi&origin=' + req.query.from + '&destination=' + req.query.to
    //   console.log(url)
    let wayPoints = await axios.get(url).then(ress => {
        return ress.data
    }).catch(error => {
        return false
    })
    res.send(wayPoints)
})
app.get('/parking-street', async (req, res) => {
    let temp = await axios.get('http://192.168.3.226:1026/v2/entities/?type=OnStreetParking', config).then(res => {
        // console.log('res',res.data)
        return res.data
    }).catch(err => {
        // console.log('err')
        return false
    })
    // console.log(temp)
    res.send(temp)
})
app.get('/mitc-iot-devices', async (req, res) => {
    let temp = await axios.get('http://192.168.3.226:1026/v2/entities/?type=mitc-iot-devices', config).then(res => {
        // let temp = await axios.get('http://192.168.1.7:4061/iot/devices', config).then(res => {
        // console.log('res',res.data)
        return res.data
    }).catch(err => {
        // console.log('err')
        return false
    })
    // console.log(temp)
    res.send(temp)
})
// console.log(socketIO)

// listen for requests
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3005;

server.listen(port, () => {
    console.log("Server is listening on port " + port);
});