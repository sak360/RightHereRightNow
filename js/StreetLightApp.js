////////////////////////////////////////////////////////////////////
// Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified by Sharad on 6th November
// Creating Street Light
////////////////////////////////////////////////////////////////////
var StreetLightApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.streetLightFeatureJson = {};


        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];
        this.streetWeekSelection = 0;
        this.streetMonthSelection = 0;
        this.streetWeekChicago = 0;
        this.streetMonthChicago = 0;
        this.streetPathWkVar = 0;
        this.streetPathMnVar = 0;
        this.streetJson = null;
        this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1500;
        this.barCanvasHeight = 500;

        this.barWidth = 0;
        this.barHeight = 0;
        
        this.svgBar = null;
        
        this.myTag = "";

    },

    /////////////////////////////////////////////////////////////

    startup: function (whereToRender)
    {
        console.log('Inside StreetLight Startup');
        this.myTag = whereToRender;
        this.updateScreen();
    },
    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.  
    drawBarChart: function (data)
    {
        //console.log('Inside drawBarChart');
        //console.log(data);
        this.updateWindow();
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var svg = this.svgBar;
        
        svg.selectAll("path").remove();
                
        var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], .2);

        var x1 = d3.scale.ordinal();        
        
        var y = d3.scale.linear()
                .range([height, 0]);
                
        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6"]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));
                
        var flowNames = d3.keys(data[0]).filter(function(key) { 
            return key === "Week" || key === "Month";
        });
                
        data.forEach(function(d) {
            d.flows = flowNames.map(function(name) { 
                return {
                    name: name, 
                    value: +d[name]
                }; 
            });
        });
                
        x0.domain(data.map(function(d) { 
            //return d.TIME_INTERVAL; 
            return d.AreaFocus;
        }));

        x1.domain(flowNames).rangeRoundBands([0, x0.rangeBand()]);

        y.domain([0, d3.max(data, function(d) { 
            return d3.max(d.flows, function(d) { 
                return d.value; 
            }); 
        })]);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);   
                
        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("Number of Reports");
                
        var age_interval = svg.selectAll(".time_interval")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { 
                return "translate(" + x0(d.AreaFocus) + ",0)"; 
            })
            
        age_interval.selectAll("rect")
            .data(function(d) { return d.flows; })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { 
                return x1(d.name); 
            })
            .attr("y", function(d) {
                return y(+d.value);
            })
            .attr("height", function(d) { 
                return height - y(+d.value);
            })
            .style("fill", function(d) { 
                return color(d.name); 
            }); 

        svg.selectAll("text.label")
            .data(data)
            .enter()
            .append("text")
            .text(function(d){
                return 'Week : ' + d.Week + ' & ' + 'Month :' + d.Month; 
            })
            .attr("text-anchor", "middle") 
            .attr("x", function(d, index) {
            return (x0(d.AreaFocus) + (x0.rangeBand()/2)) - 25;
            })  
            .attr("y", function(d) {
                return y(Math.max(d.Week, d.Month) + 10);
            })
            .style("font-size","20pt");

        var legend = svg.selectAll(".legend")
            .data(flowNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
                return "translate(0," + i * 20 + ")"; 
            });

        legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

        legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".1em")
          .style("text-anchor", "end")
          .text(function(d) { 
            return d; 
        });
                        
        svg.selectAll(".chart-title")
            .data(data)
           .enter()
           .append("text")
           .attr("x", width/2)
           .attr("y", height-550)
           .attr("text-anchor","middle")
           .attr("font-family", "Lato")
           .attr("font-size","50pt")
           .text("311-Reported StreetLight Outage");
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function ()
    {
        var xWin, yWin;
        
        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;
        
        var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;
		document.getElementById('streetlightbarchart').innerHTML = "";
        this.svgBar = d3.select(this.myTag).append("svg:svg")
        .attr("width", this.barWidth)
        .attr("height", this.barHeight)
        .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){    
        //console.log('updateData StreetLight');
        //var fileToLoad = "App/json/InboundOutboundTrips/max_inbound_outbound_flow.json";
        var streetLightChicago = 'https://data.cityofchicago.org/resource/zuxi-7xem.json?&$order=creation_date%20DESC';
            
        var streetMonthSelection = this.streetMonthSelection;
        var streetWeekSelection = this.streetWeekSelection;

        var streetWeekChicago = 0;
        var streetMonthChicago = 0;

        var self = this;
        //var PotHoleJson;
        d3.json(
            streetLightChicago, 
            function(err, response)
                {

                    var data1 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

                        var today = new Date();
                        if(d.creation_date != null){

                            d.myDate = parseDate(d.creation_date);

                            d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                            if(d.daysAgo <15) {
                                return d;
                            } 
                        }
                    });

                    streetWeekChicago = data1.length; 

                    var data2 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
                        //console.log(d.creation_date);
                        var today = new Date();
                        if(d.creation_date != null){

                            d.myDate = parseDate(d.creation_date);

                            d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                            if (d.daysAgo <31) {
                                return d;   
                            }  
                        }
                    }); 

                    streetMonthChicago = data2.length;

                    var streetJson = 
                    [
                        { "AreaFocus" : "SelectedArea", "Week" : mapContainer.streetlightsWeekSeen.length, "Month" : mapContainer.streetlightsMonthSeen.length},
                        {"AreaFocus": "Chicago", "Week" : streetWeekChicago, "Month" : streetMonthChicago }
                    ];

                    //console.log('Street Light Data' +  streetWeekSelection + streetMonthSelection + streetWeekChicago + streetMonthChicago);

                    self.streetJson = streetJson;

                    self.drawBarChart(streetJson);

        });
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){
      
      this.updateData();
    },
////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTION TO GET Street Light
////////////////////////////////////////////////////////////////////

    makeCallback: function (streetLightCollection,update) {
        //console.log("inside makeCallback for streetlights");
        ///////////////////////////
		if (!update) {
			var streetFeatureJson ={};
			mapContainer.streetlightsSeen = [];
            mapContainer.streetlightsWeekSeen = [];
            mapContainer.streetlightsMonthSeen = [];
            this.StreetIterator = 'XX';
		}
        ///////////////////////////


            var streetWeekCounter = 0;
            var streetMonthCounter = 0;

        streetLightCollection.forEach(function(d) {

            var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
			if ((!update) || (window.sc < 5)) {
	            if (d.latitude && d.longitude)
	                {
	                mapContainer.streetlightsSeen.push(d.service_request_number);
	                    //console.log('inside makeCallback PotHoleApp');
	                    if (isNaN(d.latitude))
	                        console.log("latitude is not a number");
	                    if (isNaN(d.longitude))
	                        console.log("longitude is not a number");
	                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);
	
	                    var today = new Date();
	                    d.myDate = parseDate(d.creation_date);
	                    //console.log('d.myDate  '  + d.myDate);
	                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373
	
	                    //console.log('d.daysAgo '  +d.daysAgo);
	                    //Getting Custom Message for User based on status of the request
	                    if(d.status == 'Open'){
	                        d.status_message = 'Travel with Caution!';
	                    }
	                    else{
	                        d.status_message = 'Street Light Fixed!';
	                    } 
	
	                    if(d.daysAgo < 15){
	                        streetWeekCounter = streetWeekCounter + 1;
                            mapContainer.streetlightsWeekSeen.push(d.service_request_number);
	                        streetLightFeatureJson = {
	                                "type": "Feature",
	                                    "properties": {},
	                                    "geometry": {
	                                        "type": "Point",
	                                        "coordinates": [d.longitude,d.latitude]
	                                    }
	                            }
	
	                            // var stationGeoJson = 
	                            L.geoJson(streetLightFeatureJson, { 
	                                pointToLayer: function (feature, latlng) {
	                                    
	                                    var content = '<b><center><u>StreeLights Card</u></center></b>'
                                                    + '<P><B> Date Reported: </B>' 
	                                                + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
	                                                + d.status + '<B><BR> Street: </b>' 
	                                                + d.street_address + '<BR><b>'
	                                                + d.status_message +  '</P></b>';
	                                    //console.log('POTHOLE');
	                                    var popup = L.popup().setContent(content);
	
	                                    /*var blueMarkerOptions = {
	                                        radius: 10,
	                                        fillColor: "Orange",
	                                        color: "#000",
	                                        weight: 1,
	                                        opacity: 1,
	                                        fillOpacity: 0.8
	                                    };
	                                    */
	                                    var redMarker = 
	                             L.AwesomeMarkers.icon({icon: 'lightbulb-o', markerColor: 'red', prefix: 'fa', iconColor: 'black'});
	
	                            var marker = L.marker(latlng, {icon: redMarker});
	                                marker.bindPopup(popup);
	                            return marker;  
	                                    
	                                }
	                        }).addTo(mapContainer.StreetLightLayer);
	                    }
	                    else if (d.daysAgo < 31){
	                        streetMonthCounter = streetMonthCounter + 1;
                            mapContainer.streetlightsMonthSeen.push(d.service_request_number);
	                        streetLightFeatureJson = {
	                            "type": "Feature",
	                                "properties": {},
	                                "geometry": {
	                                    "type": "Point",
	                                    "coordinates": [d.longitude,d.latitude]
	                                }
	                        }
	
	                        // var stationGeoJson = 
	                        L.geoJson(streetLightFeatureJson, { 
	                        pointToLayer: function (feature, latlng) {
	                      
	                            var content = '<b><center><u>StreeLights Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
	                                            + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status : </B>' 
	                                            + d.status + '<B><BR> Street:</b> ' 
	                                            + d.street_address + '<BR><b>'
	                                            + d.status_message +  '</b></P>';      
	                            //console.log('POTHOLE');
	                            var popup = L.popup().setContent(content);
	
	                            /*var blueMarkerOptions = {
	                                radius: 10,
	                                fillColor: "Orange",
	                                color: "#000",
	                                weight: 1,
	                                opacity: 1,
	                                fillOpacity: 0.8
	                            };*/
	                            var redMarker = 
	                             L.AwesomeMarkers.icon({icon: 'lightbulb-o', markerColor: 'black', prefix: 'fa', iconColor: 'yellow'});
	
	                        var marker = L.marker(latlng, {icon: redMarker});
	                            marker.bindPopup(popup);
	                        return marker;  
	                                
	                        }
	                        }).addTo(mapContainer.StreetLightLayer);
	                    }
				}
	
	                
			} else if (mapContainer.streetlightsSeen.indexOf(d.service_request_number) == -1) {
				mapContainer.streetlightsSeen.push(d.service_request_number);
				window.updates.push("New streetlight data found at "+d.street_address+" - "+d.type_of_service_request+"<br />");
					            if (d.latitude && d.longitude)
	                {
	                    //console.log('inside makeCallback PotHoleApp');
	                    if (isNaN(d.latitude))
	                        console.log("latitude is not a number");
	                    if (isNaN(d.longitude))
	                        console.log("longitude is not a number");
	                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);
	
	                    var today = new Date();
	                    d.myDate = parseDate(d.creation_date);
	                    //console.log('d.myDate  '  + d.myDate);
	                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373
	
	                    //console.log('d.daysAgo '  +d.daysAgo);
	                    //Getting Custom Message for User based on status of the request
	                    if(d.status == 'Open'){
	                        d.status_message = 'Travel with Caution!';
	                    }
	                    else{
	                        d.status_message = 'Street Light Fixed!';
	                    } 
	
	                    if(d.daysAgo < 15){
	                        streetWeekCounter = streetWeekCounter + 1;
                            mapContainer.streetlightsWeekSeen.push(d.service_request_number);
	                        streetLightFeatureJson = {
	                                "type": "Feature",
	                                    "properties": {},
	                                    "geometry": {
	                                        "type": "Point",
	                                        "coordinates": [d.longitude,d.latitude]
	                                    }
	                            }
	
	                            // var stationGeoJson = 
	                            L.geoJson(streetLightFeatureJson, { 
	                                pointToLayer: function (feature, latlng) {
	                                    
	                                    var content = '<b><center><u>StreeLights Card</u></center></b>'
                                                    + '<P><B> Date Reported: </B>' 
	                                                + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
	                                                + d.status + '<B><BR> Street: </b>' 
	                                                + d.street_address + '<BR><b>'
	                                                + d.status_message +  '</P></b>';
	                                    //console.log('POTHOLE');
	                                    var popup = L.popup().setContent(content);
	
	                                    /*var blueMarkerOptions = {
	                                        radius: 10,
	                                        fillColor: "Orange",
	                                        color: "#000",
	                                        weight: 1,
	                                        opacity: 1,
	                                        fillOpacity: 0.8
	                                    };
	                                    */
	                                    var redMarker = 
	                             L.AwesomeMarkers.icon({icon: 'lightbulb-o', markerColor: '#d8ad95', prefix: 'fa', iconColor: 'black'});
	
	                            var marker = L.marker(latlng, {icon: redMarker});
	                                marker.bindPopup(popup);
	                            return marker;  
	                                    
	                                }
	                        }).addTo(mapContainer.StreetLightLayer);
	                    }
	                    else if (d.daysAgo < 31){
	                        streetMonthCounter = streetMonthCounter + 1;
                            mapContainer.streetlightsMonthSeen.push(d.service_request_number);
	                        streetLightFeatureJson = {
	                            "type": "Feature",
	                                "properties": {},
	                                "geometry": {
	                                    "type": "Point",
	                                    "coordinates": [d.longitude,d.latitude]
	                                }
	                        }
	
	                        // var stationGeoJson = 
	                        L.geoJson(streetLightFeatureJson, { 
	                        pointToLayer: function (feature, latlng) {
	                      
	                            var content = '<b><center><u>StreetLights Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
                                            + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status : </B>' 
                                            + d.status + '<B><BR> Street:</b> ' 
                                            + d.street_address + '<BR><b>'
                                            + d.status_message +  '</b></P>';      
	                            //console.log('POTHOLE');
	                            var popup = L.popup().setContent(content);
	
	                            /*var blueMarkerOptions = {
	                                radius: 10,
	                                fillColor: "Orange",
	                                color: "#000",
	                                weight: 1,
	                                opacity: 1,
	                                fillOpacity: 0.8
	                            };*/
	                            var redMarker = 
	                             L.AwesomeMarkers.icon({icon: 'lightbulb-o', markerColor: '#d8ad95', prefix: 'fa', iconColor: 'black'});
	
	                        var marker = L.marker(latlng, {icon: redMarker});
	                            marker.bindPopup(popup);
	                        return marker;  
	                                
	                        }
	                        }).addTo(mapContainer.StreetLightLayer);
	                    }
	
	
	                }
	            }
        });
           this.streetWeekSelection = streetWeekCounter;
           this.streetMonthSelection = streetMonthCounter;
            if(mapContainer.mode =='Path'){
                if(mapContainer.iterator == 'XX'){
                    this.streetPathWkVar = 0;
                    this.streetPathMnVar = 0;
                }
                this.streetPathWkVar =  this.streetPathWkVar + streetWeekCounter;
                this.streetPathMnVar = this.streetPathMnVar + streetMonthCounter;
                this.streetWeekSelection = this.streetPathWkVar;
                this.streetMonthSelection = this.streetPathMnVar;
                console.log('streetWeekCounter :'  + streetWeekCounter + ' this.streetPathWkVar : ' + this.streetPathWkVar);
                console.log('streetMonthCounter :'  + streetMonthCounter+ ' this.streetPathMnVar : ' + this.streetPathMnVar);
                console.log('Path Mode Week Street : ' + this.streetWeekSelection );
                console.log('Path Mode month Street'  + this.streetMonthSelection);
                console.log('mapContainer.iterator'  + mapContainer.iterator);
                //mapContainer.iterator = mapContainer.iterator + 1;
                  mapContainer.iterator = 'YY'; 
            console.log('After YY'  + mapContainer.iterator);
        }
        
        
        this.startup('#streetlightbarchart');
    },

////////////////////////////////////////////////////////////////////
// STREET LIGHT CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////

    streetLightLayerFunc: function (marLat1,marLng1,marLat2,marLng2,update) {
        
        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;

        // Clear data from the layer
        //mapContainer.StreetLightLayer.clearLayers(); 

        var self = this;

        var zipCode = this.marLat1 + ',' + this.marLng1 + ',' + this.marLat2  + ',' +  this.marLng2 + ')';

        var bracket = ")";

        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location,".concat(zipCode);
            query = query + '&$order=creation_date%20DESC';

        console.log('Street Light'  + query);
        //'https://data.cityofchicago.org/resource/zuxi-7xem.json?zip_code='.concat(zipCode);
        //'http://data.cityofchicago.org/resource/7as2-ds3y.json?zip='.concat(zipCode);
        d3.json(
            query, 
            function(err, response)
                {
                if(err)
                    {
                    console.log("NO DATA at " + this.marLat1 + " " + this.marLng1);
                    return;
                    }
                    self.makeCallbackFunc(response,update);
                });

    },

////////////////////////////////////////////////////////////////////
// STREET LIGHT CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////
    streetLightPolylineLayerFunc: function (lat,lng,update) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;

        // Clear previous data from the layer

        //mapContainer.StreetLightLayer.clearLayers();

        var self = this;

        // Taking Location and 500 metre distance around it
        var zipCode = this.marPolyLat + ',' + this.marPolyLng + ',' +'500' + ')';

        var bracket = ")";

        var query = "https://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_circle(location,".concat(zipCode);
        //https://soda.demo.socrata.com/resource/earthquakes.json?$where=within_circle(location, 47.616810, -122.328064, 50000)
            query = query + '&$order=creation_date%20DESC';

        console.log(query);
        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        //'https://data.cityofchicago.org/resource/zuxi-7xem.json?zip_code='.concat(zipCode);
        //'http://data.cityofchicago.org/resource/7as2-ds3y.json?zip='.concat(zipCode);
        d3.json(
            query, 
            function(err, response)
                {
                if(err)
                    {
                    console.log("NO DATA at " + this.marPolyLat + " " + this.marPolyLng );
                    return;
                    }
                    self.makeCallbackFunc(response,update);
                });

    },
////////////////////////////////////////

    init: function () {


        this.makeCallbackFunc = this.makeCallback.bind(this);
       
    }

});
