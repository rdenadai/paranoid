// Shorthand for $( document ).ready()
$(function() {
    const ipcRenderer = require('electron').ipcRenderer;
    var conf = {};
    var secret = '';

    ipcRenderer.on('receive-secret-key', function(event, sec) {
        secret = sec.toString().trim();
    });
    ipcRenderer.send('get-secret-key');

    ipcRenderer.on('loaded-configuration', function(event, conf) {
        if(conf) {
            conf = JSON.parse(conf);
            var server_uri = conf['server_uri'];
            if(!!server_uri) {
                $('#server_uri').val(sjcl.decrypt(secret, server_uri));
            }
        }
    });
    ipcRenderer.send('load-configuration');

    $('#btn-save-serve').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var dialog = document.querySelector('dialog');
        if (! dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }

        dialog.querySelector('.agree').addEventListener('click', function() {
            var server_uri = sjcl.encrypt(secret, ($('#server_uri').val()).toString().trim());
            if (!!server_uri) {
                conf['server_uri'] = server_uri;
                ipcRenderer.send('save-configuration', JSON.stringify(conf));
                location.href = 'index.html';
            } else {
                dialog.close();
                $('#dialog-intern-message').html('Please, type the server name or ip address.');
                dialog.showModal();
            }
        });
        dialog.querySelector('.close').addEventListener('click', function() {
            dialog.close();
        });

        dialog.showModal();
    });

    $('#btn-back').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        location.href = 'index.html';
    });
});
