var programID = sessionStorage.programID;

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var authToken = sessionStorage.authorization;

var patient_hash = {}
      
tt_cancel_destination = '/reports/select';

tt_show = '/reports/select';


$(document).ready(function(){

  var table = document.getElementById("table");
      
  patient_ids = getUrlParams()["ids"].slice(3, -3).split("%2c");
  
  for (var i = 0; i < patient_ids.length; i++ ){

    id = patient_ids[i];

    var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/patients/' + patient_ids[i];
    
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function () {

      if (this.readyState == 4 && this.status == 200) {

        var results = JSON.parse(this.responseText);
        
        var dob = results.person.birthdate;
        
        var identifier = "";
        
        var date_registered = results.date_created.split("T")[0];
        
        var patient_name = results.person.names[0].given_name + " " + results.person.names[0].family_name;
        
        var patient_id = results.patient_id;

        try {

          for (var index = 0; index < results.patient_identifiers.length; index++) {
                        
            if(results.patient_identifiers[index]["identifier_type"] == 3) {
            
              identifier =  results.patient_identifiers[index]["identifier"];
            
            }
            
          }
          
        } catch (e) {
        
            console.log(e); 
        
        }

        row = document.createElement("div");

        row.className = "row";

        div1 = document.createElement("div");

        div1.className = "cell";

        div1.innerHTML = identifier;


        div2 = document.createElement("div");

        div2.className = "cell";

        div2.innerHTML = patient_name;

        
        div3 = document.createElement("div");

        div3.className = "cell";

        div3.innerHTML = date_registered;

        div4 = document.createElement("div");

        div4.className = "cell";

        div4.innerHTML = dob;

        div5 = document.createElement("div");

        div5.className = "cell";

        div5.innerHTML = "<button onmousedown=\"getValue('','"+patient_id+"','encounters2', 'btn btn-primary btn-lg', 'button')\"'>"+patient_id+"</button>";

        row.append(div1)

        row.append(div2)

        row.append(div3)

        row.append(div4)

        row.append(div5)

        table.appendChild(row);

      }
      
    };
    
    try {
    
      req.open('GET', url, true);
    
      req.setRequestHeader('Authorization', sessionStorage.getItem("authorization"))
    
      req.send(null);
    
    } catch (e) {
    
        console.log(e);

    }

  }
  
});

function getValue(value, id, div, className, itemType) {
        
  // var encounters = document.getElementById(div);
  
  //document.getElementById("encounterDate").innerHTML = moment(value).format("DD/MMM/YYYY");
  
  sessionStorage.setItem("value", value);
  
  //if (encounters.innerHTML != null) {
  
  //    encounters.innerHTML = "";
  
  //} else {
  
  //}
  
  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/encounters?paginate=false&patient_id=' + id //+ '&date=' + value;
  
  var req = new XMLHttpRequest();
  
  var counter = 0;
  
  req.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

      var results = JSON.parse(this.responseText);

      console.log(results);

      document.getElementById("encounterHeader").innerHTML = results.length + " Activities";

      var listGroup = document.createElement("div");

      listGroup.setAttribute("class", "list-group");

      encounters.appendChild(listGroup);

      for (var x = 0; x < results.length; x++) {

        var d = new Date(results[x].encounter_datetime);

        var f = moment(d).format("HH:mm A");


        if (itemType == "table") {

          var a = document.createElement("a");

          var aclass = "list-group-item d-flex justify-content-between";

          aclass += " align-items-center list-group-item-action list-group-item- primary list-group-links";

          a.setAttribute("class", aclass);

          a.setAttribute("href", "#");

          //a.setAttribute("onmousedown","getEncounter('" + results[x].encounter_id + "')");

          a.innerHTML = results[x].type.name;


          var s = document.createElement("span");

          s.setAttribute("class", "badge badge-primary badge-pill");

          s.innerHTML = f;

          a.appendChild(s);

          listGroup.appendChild(a);

          if (x == 2 || (results.length == 2 && x == 1)) {

            var a = document.createElement("a");

            var aclass = "list-group-item d-flex justify-content-between";

            aclass += " align-items-center list-group-item-action list-group-item- primary list-group-links";

            a.setAttribute("class", aclass);

            a.setAttribute("href", "#");

            a.innerHTML = "Click to show more ..."

            listGroup.appendChild(a);

            break;

          }
        
        } else if (itemType == "button") {
        
            encounters.innerHTML +=
        
            '<button type="button" id="' + results[x].encounter_ixd + '" value="' + results[x] +
        
            '" class="btn btn-primary btn-sm" style="width: 98%;  margin: 1%; border-radius: 0%; height: 50px;" onClick="getEncounter(' + results[x].encounter_id + ')">' +
        
            '<span class="h5">' + results[x].type.name + '</span></button>';
        
        }

      }
  
    }
  
  };
  
  try {
  
    req.open('GET', url, true);
  
    req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
  
    req.send(null);
  
  } catch (e) {

    console.log(e);

  }

}

function __$(id){

  return document.getElementById(id);

}

function expand(id){
  
  if(id.trim().length > 0){
  
    console.log(id);
  
    if(__$(id).style.display == "none"){
  
      if(__$("__" + id)){
  
        __$("__" + id).style.display = "none";
  
      }
    
      __$(id).style.display = "block";
    
      return "/images/minus.png";
    
    } else {
    
      __$(id).style.display = "none";
    
      if(__$("__" + id)){
    
        __$("__" + id).style.display = "block";
    
      }
      
      return "/images/plus.png";
    
    }
  
  }

}

function expandDiv(url, id){

  if(id.trim().length > 0){

    if(__$(id).style.display == "none"){

      if(__$("__" + id)){

        __$("__" + id).style.display = "none";

      }
  
      ajaxify(url, id,  "__$(id).style.display = 'block'")
  
      return "/images/minus.png";
  
    } else {
  
      __$(id).style.display = "none";
    
      if(__$("__" + id)){
    
        __$("__" + id).style.display = "block";
    
      }
      
      return "/images/plus.png";
      
    }
    
  }

}

function ajaxify(url, id, expr){

  var httpRequest = new XMLHttpRequest();
  
  httpRequest.onreadystatechange = function() {

    if (httpRequest && httpRequest.readyState == 4 && (httpRequest.status == 200 ||

        httpRequest.status == 304)) {

        var result = JSON.parse(httpRequest.responseText);

        for (var i in result){

            __$(result[i]["eid"]+ "_name").innerHTML = ((parseInt(i) + 1) + ". " +
                          result[i]["name"] + " <i> (" + result[i]["date"] + ")</i>");
                  __$(result[i]["eid"]+ "_obs").innerHTML = result[i]["obs"];
              }
            eval(expr);
        }
    };
    try {
        httpRequest.open('GET', url, true);
        httpRequest.send(null);
    } catch(e){}
}

