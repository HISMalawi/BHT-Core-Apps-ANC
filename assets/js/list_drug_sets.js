var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var authToken = sessionStorage.authorization;
  
var drugSetHash = {};

function setUpDrugSetPage() {

    var f = document.getElementById('inputFrame' + tstCurrentPage);
  
    f.style = 'width: 96%; height: 88%;';
  
    var div = document.createElement('div');
  
    div.setAttribute('class','main-table');
  
    f.appendChild(div);
  
    var row = document.createElement('div');
  
    row.setAttribute('class','table-row');
  
    div.appendChild(row);
  
    var cells = ['left','right'];
  
    for(var i = 0 ; i < cells.length ; i++){
  
      var cell = document.createElement('div');
  
      cell.setAttribute('class','table-cell');
  
      cell.setAttribute('id','cell-' + cells[i]);
  
      row.appendChild(cell);
  
    }
   
    fetchDrugSets(); 
    
    var nextButton = document.getElementById('nextButton');
  
    nextButton.setAttribute('onmousedown', 'addDrugSet();');
  
    nextButton.innerHTML = '<span>Add Drug Set</span>';
  
  }
  
  function addDrugSet(){
  
    window.location.href = "/apps/ANC/views/drugs/drug_sets.html"
  
  }
  
  function fetchDrugSets() {
      
    var apiPath = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/drug_sets"

    var drug_sets = {};

    GET({

      url: apiPath,

      async: true,

      headers: {

        'Authorization': authToken

      }

    }, 
    {}, 
    function (data) {
    
      for(key in data["set_names"]){

        set_name = data["set_names"][key];

        if (drug_sets[key] === undefined){
            drug_sets[key] = {}
        }

        drug_sets[key]["name"] = set_name;
        
        drug_sets[key]["description"] = data["set_descriptions"][key];

        drug_sets[key]["drugs"] = data["drug_sets"][key];

      }

      displayDrugSet(drug_sets);
    
    }, 
    function (error) {
    
      console.log(error);
    
    });
    
  }
  
  
  function displayDrugSet(drug_sets) {
    var container = document.getElementById('cell-left');
    var table = document.createElement('table');
    table.setAttribute('class','set-tables');
    container.appendChild(table);
  
    for(key in drug_sets){
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.setAttribute('class','set-names');
      td.setAttribute('id', key);
      td.setAttribute('set-name', drug_sets[key].name);
      td.setAttribute('onmousedown','showDrugs(this);');
      td.innerHTML = drug_sets[key].name;
      tr.appendChild(td);
  
      if(drugSetHash[key] == undefined){
        drugSetHash[key] = [];
      }
  
      drugSetHash[key].push(drug_sets[key].drugs);
      table.appendChild(tr);
    }
  }
  
  function showDrugs(set){
    var container = document.getElementById('cell-right');
    container.innerHTML = null;
    var table = document.createElement('table');
    table.setAttribute('class','set-tables');
    container.appendChild(table);
  
    var drugs = drugSetHash[set.id];
    var setHasDrugs = false
  
    for(var i = 0 ; i < drugs.length ; i++){
      if (drugs[i].length < 1) {
        continue;
      } else {
        setHasDrugs = true
  
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.setAttribute('class','set-drugs');
        tr.appendChild(td);
        table.appendChild(tr);
  
        buildDrugs(td, drugs[i]);
      }
    }
  
    if (!setHasDrugs) {
      var tableRow = document.createElement('tr')
      tableRow.style.textAlign = 'center'
      tableRow.style.fontSize = '1.4em'
      var message = document.createElement('p')
      message.innerText = 'This program has no states so far.'
      tableRow.appendChild(message)
      table.appendChild(tableRow)
    }
  
    var btns = document.getElementsByClassName('set-names');
    for(var i = 0 ; i < btns.length ; i++){
      btns[i].style = 'background-color: "";';
    }
  
    set.style = 'background-color: lightblue;';
  
    //Add program update state button
    if(document.getElementById('void-set') == undefined) {
      var btn = document.createElement('button');
    }else{
      var btn = document.getElementById('void-set');
    }
    
    btn.setAttribute('id','void-set');
    btn.setAttribute('class','button blue navButton');
    btn.innerHTML = '<span>Void Drug Set</span>';
    btn.setAttribute('onmousedown','voidDrugSet(' + set.id + ');');
  
    var root = document.getElementById('buttons');
    root.appendChild(btn);
  }
  
  function voidDrugSet(set_id) {
    
    var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/drug_sets/' + set_id;
    url += "/?date=" + sessionStorage.sessionDate;
    
    var req = new XMLHttpRequest();
        
    req.onreadystatechange = function () {

      if (this.readyState == 4 && this.status == 204) {
        
        location.reload(); 
                
      }
      
    };
        
    try {
      
      req.open('DELETE', url, true);
      
      req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
      
      req.send(null);
      
    } catch (e) {

    }
    
  }
  
  function buildDrugs(container, drugs) {
    var table = document.createElement('table')
    table.setAttribute('class', 'drugs')
    container.appendChild(table)
  
    var headerRow = document.createElement('tr')
  
    var drugHeader = document.createElement('th')
    drugHeader.innerText = 'Drug'
    headerRow.appendChild(drugHeader)
  
    var quantityHeader = document.createElement('th')
    quantityHeader.innerText = 'Quantity' 
    headerRow.appendChild(quantityHeader)
  
    var frequencyHeader = document.createElement('th')
    frequencyHeader.innerText = 'Frequency' 
    headerRow.appendChild(frequencyHeader)
  
    table.style.padding = '4%'
    table.setAttribute('cellpadding', '10px')
  
    table.appendChild(headerRow)
    var i = 0; 
    for(key in drugs){
      var dataRow = document.createElement('tr')
      if (i % 2 == 0) {
        dataRow.style.backgroundColor = 'grey'
        dataRow.style.color = 'white'
      }
  
      var drugName = document.createElement('td')
      drugName.innerText = drugs[key].drug_name;
      dataRow.appendChild(drugName)
  
      var quantity = document.createElement('td')
      quantity.innerText = drugs[key].duration;
      dataRow.appendChild(quantity);
  
      var frequency = document.createElement('td')
      frequency.innerText = drugs[key].frequency;
      dataRow.appendChild(frequency)
  
      table.appendChild(dataRow);
      i++;
    }
  }
  
  function stateName(num) {
    if(num == 7){
      return 'On ART';
    }else if(num == 3){
      return 'Died';
    }
  
    return num
  }