//var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var programID = sessionStorage.programID;

var sessionDate = sessionStorage.sessionDate;

function getCurrentStatistics(){
    
  var url = apiProtocol + "://" + apiURL + ":" + apiPort 
  url += "/api/v1/programs/"+programID+"/reports/visits"
  url += "?name=visits_report&start_date="+sessionDate;
    
  var xhttp = new XMLHttpRequest();
    
  xhttp.onreadystatechange = function() {
        
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            
      try{
                
        results = JSON.parse(this.responseText);
        console.log(results);
            
      } catch(e){

        console.log(e);

      }
        
    }
    
  };
  
  xhttp.open("GET", url, true);
    
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    
  xhttp.setRequestHeader('Content-type', "application/json");
    
  xhttp.send();

}

getCurrentStatistics();