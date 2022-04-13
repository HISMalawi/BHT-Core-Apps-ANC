var DataCleaningTemplate = (() => {
    const authKey = sessionStorage.authorization
    const apiProtocol = sessionStorage.apiProtocol
    const apiUrl = sessionStorage.apiURL
    const apiPort = sessionStorage.apiPort
    let reportTitle = ''
    let columns = []
    let dataParams = {}
    let ancSite = sessionStorage.currentLocation
    let dataTableOptions = {}

    const getRequest = async function (url) {
        const urlParams = Object.keys(dataParams).map( k => `${k}=${dataParams[k]}`).join('&')
        const req = await fetch(`${apiProtocol}://${apiUrl}:${apiPort}/api/v1/${url}?${urlParams}`, {
            headers: { 
                'Authorization': authKey,
                'Content-type': 'application/json'
            }
        })
        if (req && req.status === 200) {
            return req.json()
        }
    }

    const showError = function (msg) {
        const errorSection = document.getElementById('error-section')
        document.getElementById('error-msg').innerText = msg
        errorSection.style = "display:inline"
    }

    const hideError = function() {
        document.getElementById('error-section').style = "display:none"
    }

    const showLoading = function () {
        document.getElementById('loading-cover').style = "display:inline"
    }

    const hideLoading = function () {
        document.getElementById('loading-cover').style = "display:none"
    }

    const headerTemplate = function () {
        return `
            <div id="error-section" style="display:none"> 
                <div id="error-msg" style="font-size:18px;padding:10px;color: white;background:#ED4337;text-align:center;font-weight:bold;"></div>
            </div>
            <div id="loading-cover">
                <div style="position:absolute;background-color:black;width:100%;height:102%;left:0%;top:0%;z-index:990;opacity:0.65;"> </div>
                <img src="/assets/images/formloader.gif" style="position:absolute;top:150px;left:40%;z-index:991;"/>
            </div>
            <table style="width: 100%; -moz-user-select: none;margin-bottom: 10px;">
                <tr>
                    <th style="font-size: 1.5em; color: #eee; background-color: #999; padding: 5px;">
                        ${reportTitle}
                    </th>
                </tr>
                <tr>
                <td style="border: 1px solid #999;">
                    <table width="100%" cellspacing="0" cellpadding="5">
                        <tr>
                            <td style="width: 25%; font-weight: bold;border-left: 1px solid gray;">
                            ANC Site Name
                            </td>
                            <td colspan="3" style=" font-style: italic;">
                            <span id="site_name">${ancSite}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 25%; font-weight: bold;border-left: 1px solid gray;">
                                Start Date:
                            </td>
                            <td style="font-style: italic;">
                                <span id="start_date">${dataParams.start_date || 'N/A'}</span>
                            </td>
                            <td style="width: 25%; font-weight: bold;" align="right">
                                End Date:
                            </td>
                            <td style="font-style: italic;">
                                <span id="end_date">${dataParams.end_date || 'N/A'}</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        `
    }

    const tableTemplate = function () {
        const tableID = dataTableOptions.tableID
        const table = document.createElement('table')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        const tr = document.createElement('tr')
        table.id = tableID
        table.style = "text-align:center;padding:5px;font-size:0.9em;line-height:1.65;color:darkslategrey;margin-top: 0px;border: 1px solid darkslategray;"
        table.classList = dataTableOptions.tableClasses || []
        for (const index in columns) {
            const th = document.createElement('th')
            th.innerHTML = columns[index]
            tr.appendChild(th)
        }
        thead.append(tr)
        table.appendChild(thead)
        table.appendChild(tbody)
        return table
    }

    const buildTemplate = function (parentElementID, url, parser) {
        const parentDiv = document.getElementById(parentElementID)
        const table = tableTemplate()
        parentDiv.innerHTML = headerTemplate()
        parentDiv.appendChild(table)
        const dataTable = $(`#${dataTableOptions.tableID}`).DataTable({
            fixedHeader: true,
            searching: false,
            paging: false,
            scrollY: 400,
            Processing: true,
            ServerSide: true,
            scroller: {
                loadingIndicator: true
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'csv',
                    title: `${ancSite} ${reportTitle}- ${dataParams.start_date || 'N/A'} to ${dataParams.end_date || 'N/A'}`,
                    footer: true
                },
                {
                    extend: 'pdf',
                    title: `${ancSite} ${reportTitle}- ${dataParams.start_date || 'N/A'} to ${dataParams.end_date || 'N/A'}`
                }
            ]
        })
        hideError()
        showLoading()
        getRequest(url).then((data) => {
            if (data) {
                parser(data).forEach((row) => {
                    dataTable.row.add(row).draw()
                })
                hideLoading()
            }
        }).catch((error) => {
            hideLoading()
            showError(error)
        })
    }

    const generateTable = function (parentElementID, params={}) {
        reportTitle = params.reportTitle || 'ANC Report'
        dataParams = params.dataParams
        dataTableOptions = params.dataTableOptions || {}
        columns = params.columns || []
        return buildTemplate(parentElementID, params.dataUrl, params.dataParser)
    }
    return {
        generateTable
    }
})()
