// const paramInterface = {
//     title: 'string',
//     min: 'number',
//     max: 'number',
//     options: 'array',
//     validation: 'callback function',
//     onvalue: 'callback function',
//     onclose: 'callback function',
//     oncancel: 'callback function'
// }
var TT_INPUT_DIALOG = (() => {
    let formValue = null;
    let formParams = {};
    let TITLE_ID = 'tt_input_dialog_title';
    let INPUT_ID = 'tt_input_dialog_text_editor';
    let ERROR_ID = 'tt_input_dialog_error';
    let DIALOG_ID = 'tt_input_dialog';
    let DIALOG_CONTENT_ID = 'tt_input_dialog_content';
    let WINDOW_ID = 'tt_input_window'

    function hideErrors() {
        document.getElementById(INPUT_ID).style.border = '1px solid black'
        document.getElementById(ERROR_ID).style.display = 'none';
        document.getElementById(ERROR_ID).innerText = ''
    }

    function setErrors(errors) {
        if (errors && Array.isArray(errors)) {
            document.getElementById(INPUT_ID).style.border = '2px solid red'
            var errorDiv = document.getElementById(ERROR_ID);
            errorDiv.innerText = 'Errors: ' + errors.join(', ');
            errorDiv.style.display = 'inline';
        } else {
            throw 'Invalid errors parameter' + errors + ' is not an array';
        }
    }

    function onFinish() {
        var finish = function () {
            hideModal();
            // do a callback after modal is hidden
            if (typeof formParams.onfinish === 'function') {
                formParams.onfinish(formValue);
            }
        }

        if (typeof formParams.isRequired === 'boolean') {
            if (!formValue) {
                return setErrors(['Value cannot be empty'])
            }
        }

        if (typeof formParams.validation === 'function') { 
            var errors = formParams.validation(formValue);
            if (errors && Array.isArray(errors)) {
                return setErrors(errors)
            } else {
                return setErrors(['An error has occured'])
            }
        }
        
        if (typeof formParams.onWarnBeforeFinish === 'function') {
            var warning = formParams.onWarnBeforeFinish(formValue);
            if (typeof warning === 'object' && typeof warning.message === 'string') {
                return TT_ALERT.confirmMessage(warning.message, function() {
                    if (typeof warning.callback === 'function') {
                        warning.callback();
                    }
                    finish()
                })
            }
        }
        finish()
    }

    function titleHeadElement(title) {
        let titleHead = document.createElement('b')
        titleHead.id = TITLE_ID
        titleHead.innerText = title || 'Input form';
        titleHead.style.fontSize = '1.4rem';
        return titleHead;
    }

    function modalWindowElement(config) {
        let modalWindow = document.createElement('div');
        modalWindow.id = WINDOW_ID;
        modalWindow.style.position = 'relative';
        modalWindow.style.backgroundColor = '#fefefe';
        modalWindow.style.margin ='1% auto'; /* 15% from the top and centered */
        modalWindow.style.padding = '20px';
        modalWindow.style.border = '1px solid #888';
        modalWindow.style.width = config.width || '90%';
        modalWindow.style.height = config.height || '90%'; /* Could be more or less, depending on screen size */   
        modalWindow.style.overflow = 'hidden';
        return modalWindow;
    }

    function modalElement() {
        let modal = document.createElement('div');
        modal.id = DIALOG_ID;
        modal.style.display = 'none';
        modal.style.position = 'fixed'; /* Stay in place */
        modal.style.zIndex = 1100; /* Sit on top */
        modal.style.left = 0;
        modal.style.top = 0;
        modal.style.width = '100%'; /* Full width */
        modal.style.height = '100%'; /* Full height */
        modal.style.overflow = 'auto'; /* Enable scroll if needed */
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; /* Black w/ opacity */
        return modal
    }

    function footerElement() {
        let modalFooter = document.createElement('div');
        modalFooter.style.position = 'absolute';
        modalFooter.style.left = 0;
        modalFooter.style.bottom = '-5px';
        modalFooter.style.width = '98%';
        modalFooter.style.minHeight = '40px';
        modalFooter.style.padding = '15px';
        modalFooter.style.backgroundColor='#333333';

        let cancelButton = newButton('Cancel', hideModal, 'red')
        let okButton = newButton('Finish', onFinish, 'green')
        cancelButton.style.float = 'left';
        okButton.style.float = 'right';

        modalFooter.appendChild(cancelButton)
        modalFooter.appendChild(okButton)
        return modalFooter;
    }

    function modalContentElement (innerContent) {
        let modalContent = document.createElement('div');
        modalContent.id = DIALOG_CONTENT_ID;
        modalContent.style.borderRadius = '15px';
        modalContent.style.border = '1px solid #333';
        modalContent.style.width = '100%';
        modalContent.style.height = '508px';
        modalContent.style.overflow = 'hidden';
        modalContent.innerHTML = innerContent;
        return modalContent;
    }

    function txtInputElement() {
        let input = document.createElement('input')
        input.id = INPUT_ID;
        input.type = 'text'
        input.readOnly = true;
        input.style.backgroundColor = '#ccc';
        input.style.padding = '5px';
        input.style.border = '1px solid black';
        input.style.borderRadius = '9px';
        input.style.width = '99.5%';
        input.style.fontFamily = `"Nimbus Sans L","Arial Narrow",sans-serif`;
        input.style.fontSize = '1.6rem';
        input.style.background = 'none';
        input.style.paddingLeft = '5px';
        return input
    }

    function errorSectionElement() {
        let errorSection = document.createElement('span');
        errorSection.id = ERROR_ID;
        errorSection.style.display = 'none';
        errorSection.style.color = 'red'
        errorSection.style.margin = '1%';
        errorSection.style.fontStyle = 'italic';
        errorSection.style.fontSize = '1.2em';
        return errorSection
    }

    function newButton(name, action, color='blue') {
        let btn = window.document.createElement('button')
        btn.id = name;
        btn.innerHTML = `<span>${name}</span>`;
        btn.className = 'button navButton ' + color
        btn.style.width= '150px';
        btn.style.fontSize = '2rem';
        btn.onclick = action
        return btn
    }

    function updateModalWindow(innerContent, title, config) {
        var modalWindow = document.getElementById(WINDOW_ID);
        if (config.width) {
            modalWindow.style.width = config.width
        }
        if (config.height) {
            modalWindow.style.height = config.height
        }
        document.getElementById(TITLE_ID).innerText = title
        documen.getElementById(DIALOG_CONTENT_ID).innerHTML = innerContent
    }

    function createModalWindow(title, innerContent, windowConfig) {
        var modal = modalElement()
        var windowElement = modalWindowElement(windowConfig)
        windowElement.appendChild(titleHeadElement(title))
        windowElement.appendChild(txtInputElement())
        windowElement.appendChild(document.createElement('p'))
        windowElement.appendChild(errorSectionElement())
        windowElement.appendChild(modalContentElement(innerContent))
        windowElement.appendChild(footerElement())
        modal.appendChild(windowElement)
        return modal
    }

    function hasOptions(params) {
        return !params.options || params.options && Array.isArray(params.options)
    }

    function onNewValue(valueObj) {
        if (typeof formParams.onvalue === 'function') {
            formParams.onvalue(valueObj)
        }
        document.getElementById(INPUT_ID).value = valueObj.label
        formValue = valueObj
        hideErrors()
    }

    function presentModal() {
        var modal = document.getElementById(DIALOG_ID);
        if (modal) {
            modal.style.display = 'inline';
        }
    }

    function hideModal() {
        value = null;
        var modal = document.getElementById(DIALOG_ID);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function insertToModal(title, content, config) {
        formValue = null;
        var windowConfg = config.window || {}
        var modalWindow = document.getElementById(DIALOG_ID);
        if (!modalWindow) {
            modalWindow = createModalWindow(title, content, windowConfg);
            window.document.body.appendChild(modalWindow);
        } else {
            updateModalWindow(title, content, windowConfg)
        }
        hideErrors()
        presentModal()
    }

    function tt_select(params={}) {
        formParams = params
        // Don't waste my precious time and resources!!
        if (!hasOptions(formParams)) {
            return
        }
        let ul = document.createElement('ul')
        ul.style.overflow = 'auto'
        ul.style.height = '100%'
        ul.style.marginTop ='5%'
        ul.style.marginBottom = '5px'
        ul.style.paddingLeft ='0px'

        formParams.options.forEach(function(option, index) {
            let li = document.createElement('li')
            li.innerText = option.label || option.value || ''
            li.style.color = 'black'
            li.style.background = index % 2 === 0 ? '#fefefe' : '#f2f2f2'
            li.style.listStyle ='none'
            li.style.padding = '4px'
            li.style.marginLeft = '5%'
            li.style.marginRight = '5%'
            li.style.marginTop = '1px'
            li.style.fontWeight = 'normal'
            li.style.marginBottom = '1px'
            li.style.fontFamily = `"Nimbus Sans L","Arial Narrow",sans-serif`
            li.style.fontSize = '1.65em'
            li.setAttribute('onmousedown', 'window.TT_INPUT_DIALOG.onNewValue(' + JSON.stringify(option) + ')')
            ul.appendChild(li)
        })
        insertToModal(formParams.title, ul.outerHTML, {})
    }

    return {
        onNewValue,
        hideModal,
        tt_select,
        insertToModal
    }
})()