'use strict'

$(document).ready(function () {
    var socket = io();
    // A dialog box is displayed when the server sends us a "message"
    socket.on('message', function (message) {
        toastr["info"](message);
    })
});

const $switches = $('.input-switch');
const host = window.location.host;

$switches.each(function (index) {
    const $self = $(this);
    getStatus(index, function (res, status) {
        if (res.relayStatus === 'ON') {
            $self[0].checked = true;
        }
    })
});

$switches.change(function () {
    console.log(this.id);
    let relayNumber;
    switch (this.id) {
        case 'switch1':
            relayNumber = 0
            break;
        case 'switch2':
            relayNumber = 1
            break;
        case 'switch3':
            relayNumber = 2
            break;
        case 'switch4':
            relayNumber = 3
            break;

        default:
            break;
    }
    toggleStatus(relayNumber);

});

function toggleStatus(relayNumber, status1) {
    let callback = function (res, status) {
        if (res.relayStatus === 'ON') {
            $.post("http://" + host + "/off/" + [relayNumber], status1);
        } else {
            $.post("http://" + host + "/on/" + [relayNumber], status1);
        }
    }

    getStatus(relayNumber, callback);
}

function getStatus(relayNumber, callback) {
    $.get("http://" + host + "/status/" + [relayNumber], callback)
}