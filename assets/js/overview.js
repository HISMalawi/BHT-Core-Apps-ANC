//var tstCurrentDate = moment(tstCurrentDate).format("YYYY-MM-DD");

var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var programID = sessionStorage.programID;

var sessionDate = sessionStorage.sessionDate;

var user = {};

var today = {};

var year = {};

$(document).ready(function(){
  
  function getCurrentStatistics(){
    
    var url = apiProtocol + "://" + apiURL + ":" + apiPort 
    url += "/api/v1/programs/"+programID+"/reports/visits"
    url += "?name=visits_report&start_date="+sessionDate;
    
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        
      if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            
        try{
                
          results = JSON.parse(this.responseText);

          year = results["year"];
        
          user = results["user"];
        
          today = results["today"];

          var i = 1;

          var k = 1;

          var j = 1;

          if (user !== undefined){

            for(u in user){

              document.getElementById('user_'+k).innerText = user[u];

              k = k + 1;

            }

          }

          if (today !== undefined){

            for(t in today){

              document.getElementById('today_'+j).innerText = today[t];
  
              j = j + 1;
  
            }

          }
        
          if (year !== undefined){

            for(y in year){

              document.getElementById('year_'+i).innerText = year[y];

              i = i + 1;

            }

          }
        
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
});