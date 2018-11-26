'use strict'

$(document).ready(function () {
    const $switches = $('.input-switch');
    const host = window.location.host;
    const socket = io();

    $switches.click(function (e) {
        e.preventDefault;
        toggleStatus(this.dataset.relaynumber);
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

    // A dialog box is displayed when the server sends us a "message"
    socket.on('message', function (message) {
        toastr["info"](message);
    });
    // Change switch status when server send us a "statuschange"
    socket.on('statuschange', function (data) {
        $switches[data.relayNumber].checked = !data.relayStatus;        
    });

});