jQuery(document).ready(function($) { 
  updateWeather();
}); 

function updateWeather() {
     $.ajax(
          { url : 
             "http://api.wunderground.com/api/9d7e28be82bf1469/geolookup/conditions/q/IL/Chicago.json", 
             dataType : "jsonp", 
             success : function(parsed_json) { 
               var location = parsed_json['location']['city']; 
               var temp_f = parsed_json['current_observation']['temp_f'];
               var temp_c = parsed_json['current_observation']['temp_c'];
               var wicon = parsed_json['current_observation']['icon'];
               d3.select('#temp').html(temp_f+'&deg;'+ 'F'); 
               d3.select('#tempc').html(temp_c+'&deg;' + 'C'); 
               d3.select('#date').html(moment().format('MMMM Do YYYY'));
               d3.select('#wicon').attr('src', 'http://icons.wxug.com/i/c/i/'+wicon+'.gif');
               d3.select('#wupdated').html('(Updated '+ moment().format("hh:mm:ss")+")");
             } 
          }); 
}
