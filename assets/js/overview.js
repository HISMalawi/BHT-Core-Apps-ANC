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
  getCurrentStatistics();
  //buildChart([ 0, 1, 2 ],[ 0, 0, 2],[ "Me", "Today", "This Year" ]);
  buildVisitsPie();
});

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

          user_visits = [user["1"],user["2"],user["3"],user["4"],user[">5"]]
          today_visits = [today["1"],today["2"],today["3"],today["4"],today[">5"]]
          year_visits = [year["1"],year["2"],year["3"],year["4"],year[">5"]]

          visit_1 = [user["1"], today["1"], year["1"]]
          visit_2 = [user["2"], today["2"], year["2"]]
          visit_3 = [user["3"], today["3"], year["3"]]
          visit_4 = [user["4"], today["4"], year["4"]]
          visit_5 = [user[">5"], today[">5"], year[">5"]]

          buildChart(visit_1,visit_2,visit_3,visit_4,visit_5,[ "Me", "Today", "This Year" ])
 
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

function buildChart(one,two,three,four,five, days) {
  // Build the chart
          Highcharts.chart('chart-column', {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'Current visit statistics'
              },
              credits: {
                  enabled: false
              },
              exporting: {
                  enabled: false
              },
              xAxis: {
                  categories: days
              },
              yAxis: {
                  allowDecimals: false,
                  title: {
                      text: 'Number of patients'
                  }
              },
  
              series: [{
                  name: 'Visit 1',
                  data: one
              }, {
                  name: 'Visit 2',
                  data: two,
                  lineWidth: 2
              }, {
                  name: 'Visit 3',
                  data: three,
                  lineWidth: 2
              }, {
                  name: 'Visit 4',
                  data: four,
                  lineWidth: 2
              }, {
                  name: 'Visit > 5',
                  data: five,
                  lineWidth: 2
              }]
          });
  
      }
      
  function buildVisitsPie(){

    // Build the chart
    Highcharts.chart('container', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
        text: 'Complete/Incomplete Visits'
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        data: [
            { name: 'Complete visits', y: 60 },
            { name: 'Incomplete visits', y: 40 }
        ]
      }]
    });
  }

      