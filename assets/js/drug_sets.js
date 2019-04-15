var tt_cancel_destination = "/";
      
var patient_id = sessionStorage.patientID;

var programID = sessionStorage.programID;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var apiProtocol = sessionStorage.apiProtocol;

var authToken = sessionStorage.authorization;

var allDrugs = [];

var drugs = {};

$(document).ready(function(){

  getDrugs();

});

function getDrugs(){

  var apiPath = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/drugs?page_size=1000"

  GET({

    url: apiPath,

    async: true,

    headers: {

      'Authorization': authToken

    }

  }, 
  {}, 
  function (data) {
    allDrugs = data;
  },
  function (error) {

    console.log(error);

  });

}

function populateDrugs(){

  var ul = $("tt_currentUnorderedListOptions");

  var select = $("drugs");

  for(var i = 0; i < allDrugs.length; i++){

    var li = document.createElement("li");

    li.id = i;

    if(parseInt(i)%2 === 0){

      li.setAttribute("tag","even");

      li.setAttribute("class","even");

    }else{

      li.setAttribute("tag","odd");

      li.setAttribute("class","odd");

    }

    li.setAttribute("tstvalue", allDrugs[i].drug_id);

    li.setAttribute("onclick", "updateInputForSelect(this);"); 

    var div1 = document.createElement("div");

    div1.style.display = "table";

    div1.style.borderSpacing = "0px";

    var div2 = document.createElement("div");

    div2.style.display = "table-row";

    var div3 = document.createElement("div");

    div3.style.display = "table-cell";

    var div4 = document.createElement("div");

    div4.innerHTML = allDrugs[i].name;

    div4.id = "optionValue"+i;

    div4.style.display = "table-cell";

    div4.style.textAlign = "left";

    div4.style.paddingLeft = "15px";

    div4.style.verticalAlign = "middle";

    var img = document.createElement("img");

    img.src = "/public/touchscreentoolkit/lib/images/unticked.jpg"

    img.id = "img"+i;

    div3.appendChild(img);

    div2.appendChild(div3);

    div2.appendChild(div4);

    div1.appendChild(div2);

    li.appendChild(div1)

    ul.appendChild(li);

  }

}

function updateInputForSelect(element){

  id = element.id;

  img = __$(id).children[0].children[0].children[0].children[0].src;

  drug_name = __$(id).children[0].children[0].children[1].innerHTML;
  
  if(img.match(/unticked/)){

    drugs[id] = drug_name;

    __$(id).style.backgroundColor = "lightblue";

    __$("img" + id).src = "/public/touchscreentoolkit/lib/images/ticked.jpg";

  }else if(img.match(/ticked/)){
  
    delete drugs[id];

    __$(id).style.backgroundColor = ""

    __$("img" + id).src = "/public/touchscreentoolkit/lib/images/unticked.jpg";

  }

}

function changeNextButton(){

  nextButton = document.getElementById("nextButton");

  nextButton.onmousedown = "";

  nextButton.onmousedown = function(){

    validateDrugSelection();

  }

}

function validateDrugSelection(){

  if (Object.keys(drugs).length === 0){

    showMessage("You must enter a value to continue")

    return;

  }else{
  
    navigateToPage(tstCurrentPage+1);
  
  }

}

function clearCachedDrugs(){

  if(Object.keys(drugs).length > 0){

    drugs = {};

  }

}

function listSelectedDrugs(){
  medication = drugs;
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'width: 96%; height: 89%; overflow: scroll;';

  var ordersTable = document.createElement('div');
  ordersTable.setAttribute('class', 'orders-table');
  frame.appendChild(ordersTable);

  var theaders = ['Drugs', 'Frequency', 'Quantity'];
  var ordersTableRow = document.createElement('div');
  ordersTableRow.setAttribute('class', 'orders-table-row');
  ordersTable.appendChild(ordersTableRow)

  for (var x = 0; x < theaders.length; x++) {
    var th = document.createElement('div');
    th.setAttribute('class', 'orders-table-row-cell');
    th.innerHTML = theaders[x];
    ordersTableRow.appendChild(th)
    if (x == 1) {
      th.style = "text-align: center; width: 20%; float: right;";
    } else if (x == 2) {
      th.style = "text-align: center; width: 28%; float: right;";
    }else {
      th.style = "width: 50%; float: left; padding-left: 10px;";
    }
  }

  var medication_given_count = 0;

  for (i in medication) {
    var ordersTableRow = document.createElement('div');
    ordersTableRow.setAttribute('class', 'orders-table-row');
    ordersTable.appendChild(ordersTableRow)

    var ordersTableCell = document.createElement('div');
    ordersTableCell.setAttribute('class', 'orders-table-cell medication-cells');
    ordersTableCell.innerHTML = medication[i];
    ordersTableCell.style = "padding-left: 10px;width: 50%; float: left;font-weight: bold;";
    ordersTableRow.appendChild(ordersTableCell)

    var ordersTableCell = document.createElement('div');
    ordersTableCell.setAttribute('class', 'orders-table-cell medication-cells pill-counts');
    ordersTableCell.innerHTML = ' - ';
    ordersTableCell.setAttribute('id', "drug_frequency_"+i);
    ordersTableCell.setAttribute('quantity', "0");
    ordersTableCell.setAttribute('drug_name', medication[i]);
    ordersTableCell.setAttribute('drug_id', i);
    ordersTableCell.setAttribute('start_date', "");
    ordersTableCell.setAttribute('equivalent_daily_dose', "");
    ordersTableCell.setAttribute('onmousedown', 'enterFrequency(this);');
    ordersTableCell.style = "font-weight: bold;font-size: 1.3em;text-align: center; width: 28%; float: right;";
    ordersTableRow.appendChild(ordersTableCell)

    var ordersTableCell = document.createElement('div');
    ordersTableCell.setAttribute('class', 'orders-table-cell medication-cells pill-counts');
    ordersTableCell.innerHTML = ' - ';
    ordersTableCell.setAttribute('id', "drug_quantity_"+i);
    ordersTableCell.setAttribute('quantity', "0");
    ordersTableCell.setAttribute('drug_name', medication[i]);
    ordersTableCell.setAttribute('drug_id', i);
    ordersTableCell.setAttribute('start_date', "");
    ordersTableCell.setAttribute('equivalent_daily_dose', "");
    ordersTableCell.setAttribute('onmousedown', 'enterQuantity(this);');
    ordersTableCell.style = "font-weight: bold;font-size: 1.3em;text-align: center; width: 20%; float: right;";
    ordersTableRow.appendChild(ordersTableCell)

    medication_given_count++;
  }
/**
        if(medication_given_count < 1){
          showMessage('Client was not given actual <br / > medication / pills last visit');
          var nextButton = document.getElementById('nextButton');
          nextButton.style = 'display: none;';
        }
*/
  document.getElementById('confirmatory-test-cover').style = 'display: none;';
}

function enterQuantity(e) {
  document.getElementById('confirmatory-test-cover').style = 'display: inline;';
  var popUpBox = document.getElementById('confirmatory-test-popup-div');
  popUpBox.style = 'display: inline';
  popUpBox.innerHTML = null;

  var table = document.createElement('table');
  table.style = 'width: 99%; height: 98%';
  popUpBox.appendChild(table);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.style = 'vertical-align: top;';
  tr.appendChild(td);

  var inputBox = document.createElement('input');
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('id', 'num-pills');
  td.appendChild(inputBox);


  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.style = 'vertical-align: top; text-align: center;';
  tr.appendChild(td);
  createKeyPad(td, e);
}

function enterFrequency(e) {
  document.getElementById('confirmatory-test-cover').style = 'display: inline;';
  var popUpBox = document.getElementById('confirmatory-frequency-popup-div');
  popUpBox.style = 'display: inline';
  popUpBox.innerHTML = null;

  var table = document.createElement('table');
  table.style = 'width: 99%; height: 98%';
  popUpBox.appendChild(table);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.style = 'vertical-align: top; text-align: center;';
  tr.appendChild(td);
  createListPad(td, e);
}

function createKeyPad(e, cell) {
  var table = document.createElement('table');
  table.setAttribute("class", "prescription-keypad");
  /* ........................................ */
  /* ........................................ */
  var keypad_attributes = [];
  keypad_attributes.push([1, 2, 3]);
  keypad_attributes.push([4, 5, 6]);
  keypad_attributes.push([7, 8, 9]);
  keypad_attributes.push(["Del.", 0, "Done"]);
  //keypad_attributes.push(["Clear","%","/"]);

  for (var i = 0; i < keypad_attributes.length; i++) {
      var tr = document.createElement("tr");
      table.appendChild(tr);

      for (var j = 0; j < keypad_attributes[i].length; j++) {
          var td = document.createElement('td');
          tr.appendChild(td);

          var span = document.createElement('span');
          span.setAttribute("class", "keypad-buttons");
          span.setAttribute("onmousedown", "enterKeypadValue(this,'" + cell.id + "');");
          span.innerHTML = keypad_attributes[i][j];
          td.appendChild(span);
      }
  }

  e.appendChild(table);

}

function createListPad(e, cell) {
  var ul = document.createElement('ul');
  ul.setAttribute("class", "prescription-keypad");
  ul.style.listStyle = "none";
  ul.style.paddingLeft = "0px";
  ul.style.textAlign = "left";
  ul.style.overflow = "scroll";
  /* ........................................ */
  /* ........................................ */
  var keypad_attributes = [
    "Once a day (OD)",
    "Twice a day (BD)",
    "Three times a day (TDS)",
    "Four times a day (QID)",
    "Five times a day (5X/D)",
    "Six times a day (Q4HRS)",
    "In the morning (QAM)",
    "Once a week (QWK)",
    "Once a month",
    "Twice a month"
  ];
  
  for (var i = 0; i < keypad_attributes.length; i++) {
      var li = document.createElement("li");
      li.style.paddingLeft = "20px";
      li.style.fontSize = "1.35em";
      li.style.marginTop = "1px";
      li.style.marginBottom = "1px";
      li.style.paddingTop = "15px";
      li.style.paddingBottom = "15px";
      li.innerHTML = keypad_attributes[i];

      if (parseInt(i%2) == 0){
        li.style.backgroundColor = "#ddd";
      }else{
        li.style.backgroundColor = "#eee";
      }
      
      li.setAttribute("onmousedown", "closePopUp2('" + cell.id + "', '"+keypad_attributes[i]+"');");

      ul.appendChild(li);
  }

  e.appendChild(ul);
}


function enterKeypadValue(e, cell_id) {
  var inputBox = document.getElementById('num-pills');

  try {

      if (e.innerHTML.match(/Del/i)) {
          inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
      } else if (e.innerHTML.match(/Clear/i)) {
          inputBox.value = null;
          removeFromHash();
      } else if (e.innerHTML.match(/Done/i)) {
          closePopUp(cell_id);
      } else {
          inputBox.value += e.innerHTML;
      }

  } catch (x) {
  }

}

var medicationPillCounts = {};

function closePopUp(cell_id) {
  var inputBox = document.getElementById('num-pills');
  var cell = document.getElementById(cell_id);
  var drug_name = cell.getAttribute("drug_name");

  if (isNumeric(inputBox.value)) {
    cell.innerHTML = inputBox.value;

    if (medicationPillCounts[drug_name] !== undefined){

      if (cell_id.match(/quantity/)){
        medicationPillCounts[drug_name]["quantity"] = inputBox.value;
      }
      
    }else {

      if (cell_id.match(/quantity/)){
        medicationPillCounts[drug_name] = {
          frequency: 0,
          quantity: inputBox.value
        };
      }

    }
  }

  document.getElementById('confirmatory-test-cover').style = 'display: none;';
  document.getElementById('confirmatory-test-popup-div').style = 'display: none;';
}

function closePopUp2(cell_id, value){

  var cell = document.getElementById(cell_id);
  var drug_name = cell.getAttribute("drug_name");

  cell.innerHTML = value; 
  if (medicationPillCounts[drug_name] !== undefined){

    medicationPillCounts[drug_name]["frequency"] = value;

  }else{

    medicationPillCounts[drug_name] = {
      frequency: value,
      quantity: 0
    };


  }
  
  document.getElementById('confirmatory-test-cover').style = 'display: none;';
  document.getElementById('confirmatory-frequency-popup-div').style = 'display: none;';

}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

