// Decleration
const net = require('net');
const ntClient = require('wpilib-nt-client');

const client = new ntClient.Client()

// Connects the client to the server on team 3571's roborio
client.start((isConnected, err) => {
    // Displays the error and the state of connection
    console.log({ isConnected, err });
}, 'localhost');

// Adds a listener to the client
client.addListener((key, val, type, id) => {
    console.log({ key, val, type, id });
})