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

  var inputFrame = document.getElementById('inputFrame'+tstCurrentPage);

  inputFrame.innerHTML = "";

  var ul = document.createElement("ul");

  ul.className = "list-group list-group-flush";

  for(key in drugs){

    var li = document.createElement("li");

    li.className = "list-group-item";

    li.innerHTML = drugs[key]

    ul.appendChild(li);

  }

  inputFrame.append(ul);

}