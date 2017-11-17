let mosca = require('mosca');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
//var getUpdateURL = "http://192.168.0.6/petpooja_sync/syncs/check_intra_server_version";
var getUpdateURL = "http://staging.petpooja.com/petpooja_sync/syncs/check_intra_server_version";
//var getUpdateURL = "http://sync.petpooja.com/syncs/check_intra_server_version";
var appPort = 3000;

var isWindow = false;
if(process.platform.toString().toLowerCase().indexOf("win") != -1){
  isWindow = true;
//  batchFileName = "demo.bat";
}

var basePath = __dirname.substr(__dirname, __dirname.lastIndexOf('/'));
if(isWindow)
  basePath = __dirname.substr(__dirname, __dirname.lastIndexOf('\\'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, api-key,udid,device-type,Authorization");
  next();
});

app.get("/", function(req, res) {
    // checkServerStatus(function(serverStatus) {
    //     res.send(serverStatus);
    // });
    mqttPublish("pendingorders","Getcalled");
    res.send("done");
});

let config = {
    "mqtt": {
        "port": 1883,
        "http_port": 1884
    }
};
//CBT:create connection settings for MQTT
let settings = {
    port: config.mqtt.port,
    stats: false,
    logger: {},
    http: {
        port: config.mqtt.http_port,
        bundle: true
    }
};
//CBT:create MQTT server on port 1883
let mqttServer = new mosca.Server(settings);
mqttServer.on('ready', setup);

function setup() {
    console.log('Mosca(mqttt) server is up and running.....', settings.port);
}

let mqttPublish = function (topic, data) {
    let message = {
        topic: topic,
        payload: JSON.stringify(data), // or a Buffer
        qos: 1, // 0, 1, or 2
        retain: false // or true
    };
    mqttServer.publish(message, function () {
        console.log('publish done!');
    });
};


// fired whena  client is connected
mqttServer.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

mqttServer.on('unsubscribed', function (topic, client) {
    mqttPublish(topic, "unsubscribed topic "+topic);
});

mqttServer.on('subscribed', function (topic, client) {
  console.log("topic",topic);
  mqttPublish(topic,"done");
});

// fired when a client is disconnecting
mqttServer.on('clientDisconnecting', function(client) {
  console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
mqttServer.on('clientDisconnected', function(client) {
  console.log('clientDisconnected : ', client.id);
});


app.listen(appPort, function() {
  console.log('UpdateData app listening on port ' + appPort)
});
