////////////////////////////////////////////////////////////////////
// Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified by Sharad on 24th November
// Creating Recent Crime
////////////////////////////////////////////////////////////////////
var RecentCrimeApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.recentCrimeFeatureJson = {};

        this.recentCrimeFeatureJson = null;
        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];
        this.crimeWeekSelection = 0;
        this.crimeMonthSelection = 0;
        
        this.batteryWeekSelection = 0;
        this.batteryMonthSelection = 0;
        this.otherWeekSelection = 0;
        this.otherMonthSelection = 0;
       
        this.crimeWeekChicago = 0;
        this.crimeMonthChicago = 0;
        this.crimeJson = null;
        this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1500;
        this.barCanvasHeight = 500;

        this.barWidth = 0;
        this.barHeight = 0;
        this.svgBar = null;
        this.myTag = "";
        //this.myTag2 = "";
    },
 /////////////////////////////////////////////////////////////
    startup: function (whereToRender)
    {
        //console.log('Inside Recent Crime Startup');
        this.myTag = whereToRender;
        this.updateScreen();
    },
    /////////////////////////////////////////////////////////////
    
     //Drawing the bar chart for Origin distribution for the first visualization group.  
    drawBarChart: function (data)
    {
        console.log('Inside Recent Crime drawBarChart');
        console.log(data);
        this.updateWindow();
        var width = this.barCanvasWidth;
        console.log(this.barCanvasWidth);

        var height = this.barCanvasHeight;
        console.log(this.barCanvasHeight);

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
            .text("Number of Crime Reports");
                
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
                return 'BiWeek : ' + d.Week + ' & ' + 'Month :' + d.Month; 
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
           .text("311-Reported Recent Crimes");
    },
    /////////////////////////////////////////////////////////////
    /*
    drawBarChart2: function (data)
    {
        //console.log('Inside drawBarChart2');
        //console.log(data);
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var svg = this.svgBar2;
        
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
            return d.CrimeType;
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
            .text("Number of Crime Reports");
                
        var age_interval = svg.selectAll(".time_interval")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { 
                return "translate(" + x0(d.CrimeType) + ",0)"; 
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
            .text("Potholes")
            .attr("text-anchor", "middle") 
            .attr("x", function(d, index) {
            return (x0(d.AreaFocus) + (x0.rangeBand()/2)) - 25;
            })  
            .attr("y", function(d) {
                return y(Math.max(d.week, d.month) + 10);
            })
            .style("font-size","60%");

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
           .attr("y", height-800)
           .attr("text-anchor","middle")
           .attr("font-family", "Lato")
           .attr("font-size","50pt")
           .text("BreakDown of Crimes in Selected Area");
    },
    */
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
        document.getElementById('crimechart').innerHTML = "";
        this.svgBar = d3.select(this.myTag).append("svg:svg")
        .attr("width", this.barWidth)
        .attr("height", this.barHeight)
        .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                   
    },

    /////////////////////////////////////////////////////////////
 updateData: function (){    
        console.log('updateData RecentCrimeApp');
        //var fileToLoad = "App/json/InboundOutboundTrips/max_inbound_outbound_flow.json";
        var crimeLightChicago = 'https://data.cityofchicago.org/resource/x2n5-8w5q.json?$order=date_of_occurrence%20DESC&$limit=20000';
            
        var crimeMonthSelection = this.crimeMonthSelection;
        var crimeWeekSelection = this.crimeWeekSelection;
        
        var batteryWeekSelection = this.batteryWeekSelection;
        var batteryMonthSelection = this.batteryMonthSelection;
        
        var propertyWeekSelection = this.propertyWeekSelection;
        var propertyMonthSelection = this.propertyMonthSelection;
        
        var otherWeekSelection = this.otherWeekSelection;
        var otherMonthSelection = this.otherMonthSelection;
        var crimeWeekChicago = 0;
        var crimeMonthChicago = 0;
        var self = this;

            d3.json(
            crimeLightChicago, 
            function(err, response)
                {
                    response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
                        
                        var today = new Date();
                        if(d.date_of_occurrence != null){

                            d.myDate = parseDate(d.date_of_occurrence);

                            d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;
                            
                            
                            if(d.daysAgo <15) {
                                //Overall
                                crimeWeekChicago = crimeWeekChicago + 1;
                       /*         if(d._primary_decsription == 'BATTERY' || d._primary_decsription == 'ASSAULT' )
                                {
                                    batteryWeekCounter = batteryWeekCounter + 1;
                                }
                            
                                if(d._primary_decsription == 'BURGLARY' || d._primary_decsription == 'ROBBERY' || d._primary_decsription == 'THEFT' )
                                {
                                    propertyWeekCounter = propertyWeekCounter + 1;
                                }
                        */
                            } 
                            if (d.daysAgo <31) {
                                //Overall
                                crimeMonthChicago = crimeMonthChicago + 1; 
                                //SubFilters
                      /*          if(d._primary_decsription == 'BATTERY' || d._primary_decsription == 'ASSAULT' )
                                {
                                    batteryMonthCounter = batteryMonthCounter + 1;
                                }
                        
                                if(d._primary_decsription == 'BURGLARY' || d._primary_decsription == 'ROBBERY' || d._primary_decsription == 'THEFT' )
                                {
                                propertyMonthCounter = propertyMonthCounter + 1;
                                }  
                       */
                            }

                            
                        }
                    });

                    /*
                    var crimechartJson = 
                    [
                        {"AreaFocus": "Chicago", "Week" : crimeWeekChicago, "Month" : crimeMonthChicago},
                        {"AreaFocus" : "SA - Battery & Assault", "Week" : batteryWeekSelection, "Month" : batteryMonthSelection},
                        {"AreaFocus" : "SA - Property Theft", "Week" : propertyWeekSelection, "Month" : propertyMonthSelection},
                        {"AreaFocus" : "SA - Other", "Week" : crimeWeekSelection, "Month" : crimeMonthSelection}
                    ];
                    */
                    //console.log('CRIME DATA' +  ' ' + crimeWeekSelection +  ' '  + crimeMonthSelection +  ' '+ crimeWeekChicago +  ' '+ crimeMonthChicago + 'Ones that matter ' + batteryWeekSelection + ' ' + propertyMonthSelection );
                    var crimechartJson = 
                    [
                        {"AreaFocus": "SelectedArea", "Week" : mapContainer.crimeWeekSeen.length, "Month" : mapContainer.crimeMonthSeen.length},
                        {"AreaFocus": "Chicago", "Week" : crimeWeekChicago, "Month" : crimeMonthChicago}
                        
                    ];
                    console.log(crimechartJson);


                    
                    //Breakdown of Crimes
                    var crimeBreakJson =                     
                    [
                        {"CrimeType": "Battery & Assault", "Week" : batteryWeekSelection, "Month" : batteryMonthSelection},
                        {"CrimeType": "Property Theft", "Week" : propertyWeekSelection, "Month" : propertyMonthSelection},
                        {"CrimeType": "Other", "Week" : otherWeekSelection, "Month" : otherMonthSelection}
                        
                    ];

                    self.crimechartJson = crimechartJson;
                    self.crimeBreakJson = crimeBreakJson;

                    // Comparison 
                    
                    self.drawBarChart(crimechartJson);

                    //self.drawBarChart2(crimeBreakJson);


        });

    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){
      this.updateData();
    },
        /////////////////////////////////////////////////////////////

    updateScreen2: function (){
      this.updateWindow2();
      this.updateData2();
    },

////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTION TO GET Recent Crime
////////////////////////////////////////////////////////////////////

    makeCallback: function (recentCrimeCollection,update) {

        ///////////////////////////
        if (!update) {
          var recentCrimeFeatureJson ={};
          mapContainer.crimeSeen = [];
          mapContainer.crimeWeekSeen = [];
          mapContainer.crimeMonthSeen = [];
        }
        var crimeWeekCounter = 0;
        var crimeMonthCounter = 0;
        
        var batteryWeekCounter = 0;
        var batteryMonthCounter = 0;
       
        var propertyWeekCounter = 0;
        var propertyMonthCounter = 0;
        ///////////////////////////

        recentCrimeCollection.forEach(function(d) {

         var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
        if ((!update) || (window.cc < 5)) {
            if (d.latitude && d.longitude)
                {
                    mapContainer.crimeSeen.push(d.case_);
                    //console.log('inside makeCallback PotHoleApp');
                    if (isNaN(d.latitude))
                        console.log("latitude is not a number");
                    if (isNaN(d.longitude))
                        console.log("longitude is not a number");
                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

                    var today = new Date();
                    d.myDate = parseDate(d.date_of_occurrence);
                    //console.log('d.myDate  '  + d.myDate);
                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373

                    //console.log('d.daysAgo '  +d.daysAgo);
                    //Getting Custom Message for User based on status of the request

                    d.status_message = 'Travel With Caution!';
                    if(d.daysAgo < 15){
                        if(d._primary_decsription == 'BATTERY' || d._primary_decsription == 'ASSAULT' ){
                            batteryWeekCounter = batteryWeekCounter + 1;
                        }
                        if(d._primary_decsription == 'BURGLARY' || d._primary_decsription == 'ROBBERY' || d._primary_decsription == 'THEFT' ){
                            propertyWeekCounter = propertyWeekCounter + 1;
                        }
                        
                        crimeWeekCounter = crimeWeekCounter + 1;
                        mapContainer.crimeWeekSeen.push(d.case_);
                        /////
                        // Creating geoJson for Marker
                        ///// 
                        recentCrimeFeatureJson = {
                            "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [d.longitude,d.latitude]
                                }
                        }

                        /////
                        // Creating markers
                        /////
                        L.geoJson(recentCrimeFeatureJson, { 
                            pointToLayer: function (feature, latlng) {
                                    
                                    var content = '<b><center><u>Crime Card</u></center></b>'
                                                + '<P><B> Date Reported: </B>' 
                                                + moment(d.myDate).format("MMM Do YYYY HH:mm") + '<br /><B> Type: </B>' 
                                                + d._primary_decsription + '<B><BR> Street:</b> ' 
                                                + d.block + '<BR><b>'
                                                + d.status_message +  '</b></P>';      
                                //console.log('CRIME');
                                var popup = L.popup().setContent(content);

                                
                                    var oldLeafIcon = L.Icon.extend({
                                        options: {
                                            //shadowUrl: '../docs/images/leaf-shadow.png',
                                            iconSize:     [55, 55],
                                            //shadowSize:   [50, 64],
                                            //iconAnchor:   [0, 0],
                                            //shadowAnchor: [4, 62],
                                            popupAnchor:  [0, 0],
                                            opacity : 0.2
                                        }
                                    });
                                    
                                    var olderIcon = new oldLeafIcon({iconUrl: './images/icon-recent-crime-bright-red.png'});

                                    var marker = L.marker(latlng,{icon: olderIcon});
                                                marker.bindPopup(popup);
                                            return marker;  
                                        
                            }
                        }).addTo(mapContainer.RecentCrimeLayer);

                    }
                    else if (d.daysAgo < 31){
                         if(d._primary_decsription == 'BATTERY' || d._primary_decsription == 'ASSAULT' )
                            {
                                batteryMonthCounter = batteryMonthCounter + 1;
                            }
                            
                        if(d._primary_decsription == 'BURGLARY' || d._primary_decsription == 'ROBBERY' || d._primary_decsription == 'THEFT' )
                             {
                                 propertyMonthCounter = propertyMonthCounter + 1;
                             }
                        
                        mapContainer.crimeMonthSeen.push(d.case_);
                        crimeMonthCounter = crimeMonthCounter + 1;
                        /////
                        // Creating geoJson for Marker
                        /////
                        recentCrimeFeatureJson = {
                            "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [d.longitude,d.latitude]
                                }
                        }
                        /////
                        // Creating markers
                        /////
                        L.geoJson(recentCrimeFeatureJson, { 
                            pointToLayer: function (feature, latlng) {
                                
                                var content = '<b><center><u>Crime Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
                                            + moment(d.myDate).format("MMM Do YYYY HH:mm") + '<br /><B> Description: </B>' 
                                            + d._primary_decsription + '<B><BR> Street:</b> ' 
                                            + d.block + '<BR><b>'
                                            + d.status_message +  '</b></P>';       
                                    //console.log('CRIME');
                                    var popup = L.popup().setContent(content);
    
                                var blueMarkerOptions = {
                                    radius: 10,
                                    fillColor: "Blue",
                                    color: "#000",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                };
                                var oldLeafIcon = L.Icon.extend({
                                options: {
                                    //shadowUrl: '../docs/images/leaf-shadow.png',
                                    iconSize:     [55, 55],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [0, 0],
                                    //shadowAnchor: [4, 62],
                                    popupAnchor:  [0, 0],
                                    opacity : 0.2
                                }
                            });
                            
                            var olderIcon = new oldLeafIcon({iconUrl: './images/icon-recent-crime-dark-50.png'});
                                
                                

                            //var redMarker = 
                            // L.AwesomeMarkers.icon({icon: 'times', markerColor: 'grey', prefix: 'fa', iconColor: 'black'});
                            var marker = L.marker(latlng, {icon: olderIcon});
                                    marker.bindPopup(popup);
                                return marker;  
                                        
                                }
                            }).addTo(mapContainer.RecentCrimeLayer);
                        }
                    }

                }
            else if (mapContainer.crimeSeen.indexOf(d.case_) == -1) {
                mapContainer.crimeSeen.push(d.case_);
    
                window.updates.push("New crime data found at "+d.block+" - "+d._primary_description+"<br />");
                if (d.latitude && d.longitude)
                {
                    //console.log('inside makeCallback PotHoleApp');
                    if (isNaN(d.latitude))
                        console.log("latitude is not a number");
                    if (isNaN(d.longitude))
                        console.log("longitude is not a number");
                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

                    var today = new Date();
                    d.myDate = parseDate(d.date_of_occurrence);
                    //console.log('d.myDate  '  + d.myDate);
                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373

                    //console.log('d.daysAgo '  +d.daysAgo);
                    //Getting Custom Message for User based on status of the request

                    d.status_message = 'Travel With Caution!';
                    if(d.daysAgo < 15){
                           crimeWeekCounter = crimeWeekCounter + 1;
                           mapContainer.crimeWeekSeen.push(d.case_);
                        /////
                        // Creating geoJson for Marker
                        ///// 
                        recentCrimeFeatureJson = {
                            "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [d.longitude,d.latitude]
                                }
                        }

                        /////
                        // Creating markers
                        /////
                        L.geoJson(recentCrimeFeatureJson, { 
                            pointToLayer: function (feature, latlng) {
                                
                                var content = '<b><center><u>Crime Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
                                            + moment(d.myDate).format("MMM Do YYYY HH:mm") + '<br /><B> Description: </B>' 
                                            + d._primary_decsription + '<B><BR> Street:</b> ' 
                                            + d.block + '<BR><b>'
                                            + d.status_message +  '</b></P>';      
                                //console.log('CRIME');
                                var popup = L.popup().setContent(content);

                            
                                var oldLeafIcon = L.Icon.extend({
                                    options: {
                                        //shadowUrl: '../docs/images/leaf-shadow.png',
                                        iconSize:     [55, 55],
                                        //shadowSize:   [50, 64],
                                        iconAnchor:   [0, 0],
                                        //shadowAnchor: [4, 62],
                                        popupAnchor:  [0, 0],
                                        opacity : 0.2
                                    }
                                });
                                
                                var olderIcon = new oldLeafIcon({iconUrl: './images/icon-recent-crime-bright-red.png'});
                                
                            //    var redMarker = 
                             //L.AwesomeMarkers.icon({icon: 'times', markerColor: 'red', prefix: 'fa', iconColor: 'black'});

                                var marker = L.marker(latlng,{icon: olderIcon});
                                                marker.bindPopup(popup);
                                            return marker;  
                                        
                            }
                        }).addTo(mapContainer.RecentCrimeLayer);

                    }
                    else if (d.daysAgo < 31){

                        crimeMonthCounter = crimeMonthCounter + 1;
                        /////
                        // Creating geoJson for Marker
                        /////
                        mapContainer.crimeMonthSeen.push(d.case_);
                        recentCrimeFeatureJson = {
                            "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [d.longitude,d.latitude]
                                }
                        }
                        /////
                        // Creating markers
                        /////
                        L.geoJson(recentCrimeFeatureJson, { 
                            pointToLayer: function (feature, latlng) {
                                
                                var content = '<b><center><u>Crime Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
                                            + moment(d.myDate).format("MMM Do YYYY HH:mm") + '<br /><B> Description: </B>' 
                                            + d._primary_decsription + '<B><BR> Street:</b> ' 
                                            + d.block + '<BR><b>'
                                            + d.status_message +  '</b></P>';       
                                    //console.log('CRIME');
                                    var popup = L.popup().setContent(content);
    
                               
                        
                            var oldLeafIcon = L.Icon.extend({
                                options: {
                                    //shadowUrl: '../docs/images/leaf-shadow.png',
                                    iconSize:     [55, 55],
                                    //shadowSize:   [50, 64],
                                    iconAnchor:   [0, 0],
                                    //shadowAnchor: [4, 62],
                                    popupAnchor:  [0, 0],
                                    opacity : 0.2
                                }
                            });
    
                            var olderIcon = new oldLeafIcon({iconUrl: './images/icon-recent-crime-dark-50.png'});
                            
                            var marker = L.marker(latlng,{icon: olderIcon});
                                            marker.bindPopup(popup);
                                        return marker;  
                                        
                                }
                            }).addTo(mapContainer.RecentCrimeLayer);
                        
                    }

                }
            }
        });
        //Overall Crime
        this.crimeWeekSelection = crimeWeekCounter;
        this.crimeMonthSelection = crimeMonthCounter ;

        //Other Crimes
        this.otherWeekSelection = crimeWeekCounter - batteryWeekCounter - propertyWeekCounter;
        this.otherMonthSelection = crimeMonthCounter - batteryMonthCounter - propertyMonthCounter;

        //Property Crime
        this.propertyWeekSelection = propertyWeekCounter;
        this.propertyMonthSelection = propertyMonthCounter;

        // Battery Crime
        this.batteryWeekSelection = batteryWeekCounter;
        this.batteryMonthSelection = batteryMonthCounter;
                    
                    //document.getElementById('crimechart2').innerHTML = "";
        this.startup('#crimechart');
        //this.startup2('#crimechart2');
        //this.startup2('#crimechart2');
    },

////////////////////////////////////////////////////////////////////
// CALLBACK function for Recent Crime for Polyline
////////////////////////////////////////////////////////////////////

    recentCrimeLayerFunc: function (marLat1,marLng1,marLat2,marLng2,update) {
        
        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;

        // Clear data from the layer
        //mapContainer.RecentCrimeLayer.clearLayers(); 

        var self = this;

        var zipCode = this.marLat1 + ',' + this.marLng1 + ',' + this.marLat2  + ',' +  this.marLng2 + ')';

        var bracket = ")";

        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/x2n5-8w5q.json?$where=within_box(location,".concat(zipCode);
            query = query + '&$order=date_of_occurrence%20DESC&$limit=20000';

        console.log('RecentCrime'  + query);

        d3.json(
            query, 
            function(err, response)
                {
                if(err)
                    {
                    //console.log("NO DATA at " + lat + " " + lon);
                    return;
                    }
                    self.makeCallbackFunc(response,update);
                });

    },

////////////////////////////////////////////////////////////////////
// RECENT CRIME CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////
    recentCrimePolylineLayerFunc: function (lat,lng,update) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;

        // Clear previous data from the layer

        //mapContainer.RecentCrimeLayer.clearLayers();

        var self = this;

        // Taking Location and 500 metre distance around it
        var zipCode = this.marPolyLat + ',' + this.marPolyLng + ',' +'500' + ')';

        var bracket = ")";

        var query = "https://data.cityofchicago.org/resource/x2n5-8w5q.json?$where=within_circle(location,".concat(zipCode);
        //https://soda.demo.socrata.com/resource/earthquakes.json?$where=within_circle(location, 47.616810, -122.328064, 50000)
            query = query + '&$order=date_of_occurrence%20DESC&$limit=20000';

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
