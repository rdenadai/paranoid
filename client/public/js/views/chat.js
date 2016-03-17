// Shorthand for $( document ).ready()
$(function() {
    const ipcRenderer = require('electron').ipcRenderer;
    const _ = require('lodash');
    var conf = {};
    var secret = '';

    /*var emojis = '';
    _.each(emojione.emojioneList, function(emoji, key) {
        emojis += '<li>' + key + '</li>';
    });
    $('#dialog-intern-emoji').html(emojione.toImage(emojis));*/

    ipcRenderer.removeAllListeners(['client-logged', 'receive-secret-key', 'loaded-configuration', 'receive-message']);
    ipcRenderer.on('client-logged', function(event, authorized) {
        if(!authorized) {
            location.href = "index.html";
        }
    });
    ipcRenderer.send('is-client-logged');
    ipcRenderer.send('send-my-pub-key');

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

    ipcRenderer.on('receive-message', function(event, message) {
        $('.chat-talk-intern').append('<div><i class="fa fa-square"></i>&nbsp;&nbsp;<span>' + message.name + ' (' + message.hora + ')</span><div>' + emojione.toImage(message.message) + '</div></div>');
    });

    var dialog = document.querySelector('dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.agree').addEventListener('click', function() {
        ipcRenderer.send('exit');
    });
    dialog.querySelector('.close').addEventListener('click', function() {
        $('#dialog-intern-message').html('');
        dialog.close();
    });

    function sendMessage() {
        var message = $('#message').val().trim();
        if(!!message) {
            ipcRenderer.send('send-message', { message: HtmlEncode(message) });
            $('.emoji-gallery').hide();
            $('#message').val('');
        }
    };

    $('#btn-exit').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $('#dialog-intern-message').html('Are you sure you want logout the Paranoid Web Chat?');
        dialog.showModal();
    });

    $('#message').on('keydown', function(event) {
        if (event.which == 13) {
            event.preventDefault();
            sendMessage();
        }
    });

    $('#btn-send-message').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        sendMessage();
    });

    $('#btn-add-emoji').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    });

    $('.emoji-picker a').on('click', function(evt) {
        $('.emoji-picker a').removeClass('active');
        var el = $(this);
        el.addClass('active');
        var tab = el.attr('data-category');

        var emojis = $('#emoji-' + tab);
        if (emojis.css('display') == 'none') {
            $('.emoji-gallery').hide();
            emojis.load('../public/emojis/' + tab + '.html');
            emojis.slideDown();
        } else {
            el.removeClass('active');
            emojis.slideUp();
        }
    });

    $(document).on("click", '.emoji-gallery li a', function(evt) {
        var el = $(this);
        var message = $('#message').val().trim();
        message += ' ' + el.attr('data-shortname');
        $('#message').val(message);
        $('#message').focus();
    });

    setInterval(function() {
        ipcRenderer.send('is-client-logged');
    }, 3000);
});
