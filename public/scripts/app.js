'use strict'

let $switches = $('.input-switch');

$switches.each(function (index) {
    let $self = $(this);
        getStatus(index, function (res, status) {
            if (res.relayStatus === 'ON') {
                $self[0].checked = true;
            }
        })
});

$switches.change(function() {
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
    toggleStatus(relayNumber, function (res, status) {
        if(status === 'success') {
            let timeout = setTimeout(function() {
            clearTimeout(timeout);
            $('.alert').removeClass('show');
            }, 3000);
            // alert(res);
            
            $('.alert').addClass('show');
            timeout();

        } else {
            alert('Error');
        }
    });
    
});

function toggleStatus(relayNumber,status1) {
    let callback = function (res, status) {
        if (res.relayStatus === 'ON') {
            $.post("http://192.168.0.100:3000/off/" + [relayNumber], status1);
        } else {
             $.post("http://192.168.0.100:3000/on/" + [relayNumber], status1);
        }
    }

    getStatus(relayNumber, callback);
}

function getStatus(relayNumber, callback) {
    $.get("http://192.168.0.100:3000/status/" + [relayNumber],callback)
}