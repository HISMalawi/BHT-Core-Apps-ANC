var patientAge = sessionStorage.patientAge;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var apiPort = sessionStorage.apiPort;

var apiURL = sessionStorage.apiURL;

var hysterectomy = false;
  
getSurgicalHistory();

$(document).ready(function(){
  // Verify patient gender
  // If gender is below thresh hold redirect to another page
  if (parseInt(programID) == 12){

    if (parseInt(patientAge) < 9){

      window.location = "/apps/ANC/views/encounters/no_minors.html"

    }

    if (hysterectomy === true){

      window.location = "/apps/ANC/views/encounters/no_hysterectomy.html"

    }
  
  }

});

function showCategory2(category) {
  if (category.length < 1)
    return;

  var pos = checkCtrl(__$("content"));

  if (__$("category")) {
    document.body.removeChild(__$("category"));
  }

  var cat = document.createElement("div");
  cat.id = "category";
  cat.style.position = "absolute";
  cat.style.right = "10px";
  cat.style.top = (pos[2] + 2) + "px";
  cat.style.fontSize = "26px";
  cat.style.padding = "10px";
  cat.style.backgroundColor = "#9e9";
  cat.style.borderColor = "#7c7";
  cat.style.color = "#000";
  cat.style.opacity = "0.95";
  cat.style.zIndex = 100;
  cat.style.textAlign = "center";
  cat.style.borderRadius = "30px";
  cat.innerHTML = category;

  document.body.appendChild(cat);
}

function getUrlParams() {
    
    // get query string from url (optional) or window
    var queryString = window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {

      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
              
        paramNum = v.slice(1,-1);
              
        return '';
            
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          
          obj[paramName] = [obj[paramName]];
              
        }
        
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
               
          // put the value on the end of the array
          obj[paramName].push(paramValue);
              
        }else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
          
        }
            
      }else {
              
        obj[paramName] = paramValue;
            
      }
          
    }
        
  }

  return obj;
      
}

function getSurgicalHistory() {

  var url = 'http://'+apiURL+':'+apiPort+'/api/v1';
  url += '/programs/'+programID+'/patients/'+patientID+'/surgical_history';

  var req = new XMLHttpRequest();

  req.onreadystatechange = function(){

    if (this.readyState == 4) {

      if (this.status == 200) {

        var results = JSON.parse(this.responseText);

        hysterectomy = results["hysterectomy"];

      }

    }

  };

  try {

    req.open('GET', url, true);

    req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));

    req.send(null);

  } catch (e) {
  
    console.log(e);

  }

}