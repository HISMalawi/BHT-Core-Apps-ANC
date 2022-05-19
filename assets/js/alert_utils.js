var TT_ALERT = (() => {
    var ALERT_ID = 'generic-alert-modal';

    function showAlert() {
        var alertDiv = window.document.getElementById(ALERT_ID)
        if (alertDiv) { 
            alertDiv.style.display = 'block'
        }
    }

    function hideAlert() {
        var alertDiv = window.document.getElementById(ALERT_ID)
        if (alertDiv) { 
            alertDiv.style.display = 'none'
        }
    }

    function alertBtn(name, action, style={}) {
        var btn = window.document.createElement('button')
        btn.id = name;
        btn.innerHTML = `<span>${name}</span>`;
        btn.style.width= style.btnWidth || '150px';
        btn.style.fontSize = style.btnFontSize || '1.4em';
        btn.style.fontStyle = style.btnFontStyle || 'bold';
        btn.style.color = style.btnFontColor || 'white';
        btn.style.margin = style.btnFontMargin || '5px';
        btn.style.padding = style.btnPadding || '5px';
        btn.style.minHeight = style.btnMinHeight || '54px';
        btn.style.minWidth = style.btnMinWidth || '75px';
        btn.style.backgroundColor = style.btnBackgroundColor || '#a7cfdf';
        btn.style.backgroundImage = 'linear-gradient(to bottom, #a7cfdf, #23538a)';
        btn.style.textShadow = '-1px -1px 0 rgba(0,0,0,0.3)';
        btn.style.textDecoration = "none"
        btn.style.borderRadius = '3px';
        btn.style.fontFamily = 'Arial, Helvetica, sans-serif';
        btn.style.fontWeight = 'bold';
        btn.style.border = '1px solid #7eb9d0';
        btn.onclick = action
        return btn
    }

    function getParentContainer() {
        var alertDiv = document.getElementById(ALERT_ID);
        if (!alertDiv) {
            alertDiv = document.createElement('div');
            alertDiv.id = ALERT_ID;
            alertDiv.style.position = 'absolute';
            alertDiv.style.width = "450px";
            alertDiv.style.top = "25%"
            alertDiv.style.fontSize = "1.5em";
            alertDiv.style.left = "25%";
            alertDiv.style.zIndex = "9999";
            alertDiv.style.backgroundColor = "tomato";
            alertDiv.style.display = "none";
            alertDiv.style.padding = "10px";
            alertDiv.style.textAlign = "center";
            alertDiv.style.border = "5px outset tomato";
            alertDiv.style.borderRadius = "15px";
            window.document.body.appendChild(alertDiv);
        } else {
            alertDiv.innerHTML = "";
        }
        return alertDiv;
    }

    function alertMessage(message) {
        var alertDiv = getParentContainer();
        var alert = document.createElement('div');
        var msgBody = document.createElement('div')
        msgBody.innerText = message;
        var footer = document.createElement('div')
        footer.appendChild(alertBtn('OK', function () {
            hideAlert();
        }));
        alert.appendChild(msgBody);
        alert.appendChild(footer);
        alertDiv.appendChild(alert);
        showAlert();
    }

    function confirmMessage(message, callback) {
        var alertDiv = getParentContainer();
        var alert = document.createElement('div');
        var msgBody = document.createElement('div')
        msgBody.innerText = message;
        var footer = document.createElement('div')
        footer.appendChild(alertBtn('Yes', function () {
            callback();
            hideAlert();
        }));
        footer.appendChild(alertBtn('No', hideAlert));
        alert.appendChild(msgBody);
        alert.appendChild(footer);
        alertDiv.appendChild(alert);
        showAlert();
    }
    return {
        hideAlert,
        alertMessage,
        confirmMessage
    }
})();