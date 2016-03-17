'use strict';

const electron = require('electron');
const io = require('socket.io-client');
const sjcl = require('./libs/sjcl.js');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

var Config = require('./models/config.js');
var secret = '#45local-key-just-for-protection199';
var pubkey = null;
var socket = null;

console.log('Generating keys... wait...');
var keys = sjcl.ecc.elGamal.generateKeys(384, 1);
var pubkem = keys.pub.kem(); //KEM is Key Encapsulation Mechanism
const pubkey_local = pubkem.key;
const seckey_local = keys.sec.unkem(pubkem.tag); //tag is used to derive the secret (private) key
console.log('keys created!');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

    // Lets connect right the way...
    // This is comment because we connect in the bottom when the renderer calls the main process using ipc
    // Config.findOne({'where': {'uid': 1}}).then(function(config) {
    //     var config2 = JSON.parse(config.configuration);
    //     var server_uri = config2['server_uri'];
    //     if(!!server_uri) {
    //         socket = io(sjcl.decrypt(secret, server_uri));
    //         socket.on('connect', function() {
    //             console.log("Conectado...");
    //             socket.emit('get-pub-key');
    //             socket.on('receive-pub-key', function(pk) {
    //                 console.log('Getting pk ...');
    //                 pubkey = pk;
    //             });
    //         });
    //     }
    // });

    // TO LEARN MORE ABOUT COMMUNICATION BETWEEN THE MAIN PROCESS AND RENDERER
    // PLEASE READ => http://electron.atom.io/docs/v0.36.7/api/ipc-main/
    // ALSO => http://electron.atom.io/docs/v0.36.7/api/web-contents/#webcontentssendchannel-arg1-arg2-
    // const ipcMain = require('electron').ipcMain;
    const ipcMain = require('ipc-main');

    ipcMain.on('get-secret-key', function(event) {
        event.sender.send('receive-secret-key', secret);
    })
    .on('save-configuration', function(event, configuration) {
       Config.findOne({'where': {'uid': 1}}).then(function(config) {
            config.update({configuration: configuration});
        });
    })
    .on('load-configuration', function(event) {
        var event = event;
        Config.findOne({'where': {'uid': 1}}).then(function(config) {
            event.sender.send('loaded-configuration', config.configuration);
        });
    })
    .on('connect-socket-server', function(event, server_url) {
        socket = io(server_url);
        // We need this 'delay', otherwise socket.connect will never be called
        setTimeout(function() {
            socket.on('connect', function() {
                console.log("connecting...");
                socket.emit('get-pub-key');
            });
            socket.on('receive-pub-key', function(pk) {
                console.log('pk received...');
                pubkey = pk;
            });
            socket.on('authenticated', function(socket) {
                // use the socket as usual
                event.sender.send('logged-in');
            });
            socket.on('unauthorized', function(err) {
                event.sender.send('logged-out', {'message': 'Username or password incorrect... please try again...'});
            });
            socket.on('is-authorized', function(authorized) {
                console.log('You are authorized!!!');
                event.sender.send('client-logged', authorized);
            });
            socket.on('receive-message', function(message) {
                message.hora = sjcl.decrypt(seckey_local, message.hora);
                message.name = sjcl.decrypt(seckey_local, message.name);
                message.message = sjcl.decrypt(seckey_local, message.message);
                event.sender.send('receive-message', message);
            });
        }, 500);
    })
    .on('login', function(event, username, password) {
        if(!!username && !!password && !!pubkey) {
            username = sjcl.encrypt(pubkey, username);
            password = sjcl.encrypt(pubkey, password);
            socket.emit('authentication', {username: username, password: password});
        } else {
            event.sender.send('logged-out', {'message': 'Username or password incorrect... please try again...'});
        }
    })
    .on('is-client-logged', function(event) {
        socket.emit('authorized');
    })
    .on('send-my-pub-key', function(event) {
        socket.emit('user-pub-key', pubkey_local);
    })
    .on('send-message', function(event, message) {
        var mensagem = sjcl.encrypt(pubkey, message.message);
        socket.emit('send-message', { message: mensagem });
    })
    .on('exit', function(event) {
        mainWindow.close();
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 425, height: 580});

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '../../../views/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        console.log('closing...');
        if(socket) {
            socket.disconnect();
            socket.close();
        }
        socket = null;
        mainWindow = null;
    });
});
