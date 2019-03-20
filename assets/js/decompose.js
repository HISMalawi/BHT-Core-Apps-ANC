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

        div5.innerHTML = "<button onmousedown=\"getEncounters("+patient_id+")\"'>"+patient_id+"</button>";

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

function getEncounters(id) {
  
  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/encounters?paginate=false&patient_id=' + id //+ '&date=' + value;
  
  var req = new XMLHttpRequest();
  
  req.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

      var results = JSON.parse(this.responseText);

      buildEncountersHash(results);
  
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

function buildEncountersHash(encounter){
    
  var encounter_hash = {};

  for(var i = 0; i < encounter.length; i++){

    encounter_date = encounter[i]["encounter_datetime"].split("T")[0];

    if(encounter_hash[encounter_date] === undefined){
        
      encounter_hash[encounter_date] = {};
    
    }
    
    encounter_name = encounter[i]["type"]["name"];
    
    encounter_hash[encounter_date][encounter_name] = {}; 
    
    observations = encounter[i]["observations"];

    for (var k = 0; k < observations.length; k++){

        var obs_name = observations[k]["concept"]["concept_names"][0]["name"];

        var coded = observations[k]["value_coded"];
        
        var datetime = observations[k]["value_datetime"];
        
        var text = observations[k]["value_text"];
        
        var numeric = observations[k]["value_numeric"];
        
        var value = "";

        if (text !== null && text.length > 0 ) {
            
          value = text;
                    
        } else if (numeric !== null) {
                        
          value = numeric;
          
        } else if (coded !== null) {
                        
          value = coded;
                  
          sessionStorage.removeItem("value_coded");
          
          var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/concepts/' + coded;
                        
          var req = new XMLHttpRequest();
          
          req.onreadystatechange = function () {

            if (this.readyState == 4) {

              if (this.status == 200) {

                var results = JSON.parse(this.responseText);

                value = results.concept_names[0].name;

                sessionStorage.setItem("value_coded", value);

              }
  
            }
  
          };
    
          try {
    
            req.open('GET', url, false);
    
            req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
    
            req.send(null);
    
          } catch (e) {
            
            console.log(e);

          }

          value = sessionStorage.getItem("value_coded");

          sessionStorage.removeItem("value_coded");

        } else if (datetime != null) {

            value = moment(datetime).format("DD/MMM/YYYY");

        } else {

        }

        encounter_hash[encounter_date][encounter_name][obs_name] = value; 

    }
    
  }
  console.log(encounter_hash);

}
