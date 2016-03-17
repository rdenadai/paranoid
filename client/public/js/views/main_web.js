// Shorthand for $( document ).ready()
$(function() {
    const ipcRenderer = require('electron').ipcRenderer;

    var conf = null;
    var userbase = null;
    var secret = '';

    ipcRenderer.on('logged-in', function(event) {
        location.href = 'chat.html';
    });
    ipcRenderer.on('logged-out', function(event, response) {
        $('#dialog-intern-message').html(response.message);
        dialog.showModal();
    });
    ipcRenderer.on('receive-secret-key', function(event, sec) {
        secret = sec;
    });
    ipcRenderer.on('loaded-configuration', function(event, configuracao) {
        if(configuracao) {
            conf = JSON.parse(configuracao);
            var server_uri = conf['server_uri'];
            if(!!server_uri) {
                var server_url = sjcl.decrypt(secret, server_uri);
                if (server_url.indexOf('http') < 0 && server_url.indexOf('https') < 0) {
                    server_url = 'http://' + server_url;
                }
                ipcRenderer.send('connect-socket-server', server_url);
            }
        }
    });

    if(typeof(localStorage) !== "undefined") {
        userbase = localStorage.getItem('.paranoid.conf');
        if(userbase) {
            userbase = JSON.parse(userbase);
        } else {
            localStorage.setItem('.paranoid.conf', JSON.stringify({'username': '', 'passwd': ''}));
        }
    }
    ipcRenderer.send('get-secret-key');
    ipcRenderer.send('load-configuration');

    var dialog = document.querySelector('dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function() {
        $('#dialog-intern-message').html('');
        dialog.close();
    });

    $('#btn-start-chat').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (conf) {
            var server_uri = conf['server_uri'];
            if(!!server_uri) {
                var username = ($('#login').val()).toString().trim();
                var password = ($('#passwd').val()).toString().trim();

                if (!!username && !!password) {
                    ipcRenderer.send('login', username, password);
                } else {
                    $('#dialog-intern-message').html('Please, type username and password!');
                    dialog.showModal();
                }
            } else {
                $('#dialog-intern-message').html('Please, you must registry a server uri to enter a chat room, please go to configurations...');
                dialog.showModal();
            }
        } else {
            $('#dialog-intern-message').html('Some configuration couldn\'t be loaded... please check your configurations and try again!');
            dialog.showModal();
        }
    });

    $('#btn-config').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        location.href = "config.html";
    });

    $('form').each(function() {
        $(this).find('input').keypress(function(e) {
            // Enter pressed?
            if(e.which == 10 || e.which == 13) {
                $('#btn-start-chat').trigger('click');
            }
        });
    });
    // Example
    // localStorage.setItem('.paranoid.conf', JSON.stringify({'conf': 'first', 'conf_2': 2}));
    setTimeout(function() {
        console.log('focus');
        $('#login').focus();
    }, 3000);
});
