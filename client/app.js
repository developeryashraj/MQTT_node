let mqtt = require('mqtt');


var client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('pendingorders')
  //client.publish('pendingorders')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log("@@@@@@@@2");
  console.log(message.toString())
//  client.end()
})
client.on('close', function (topic) {
  // message is Buffer
  console.log("close called");
//  console.log(topic)
//  client.end()
})
client.on('reconnect', function (topic) {
  // message is Buffer
  console.log("reconnect called");
  //console.log(topic)
//  client.end()
})

client.on('offline', function (topic) {
  // message is Buffer
  console.log("offline called");
  console.log(topic)
//  client.end()
})

client.on('error', function (topic) {
  // message is Buffer
  console.log("on error called");
  console.log(topic)
//  client.end()
})

//mqttClient = new mqtt.Client('localhost:3000', 1883, 'PetPooja');
//mqttClient = mqtt.connect('localhost:4000',1884);
// mqttClient.connect({onSuccess: onConnect()});
//
// function onConnect() {
// 			console.log("In OnConnect");
// 			mqttClient.subscribe("Petpooja");
//
// }

//mqttClient.subscribe('presence');
//
// console.log('Client publishing.. ');
//
// client.publish('presence', 'Client 1 is alive.. Test Ping! ' + Date());

//client.end();
