////////////////////////////////////////////////////////////////////
// by Sharad Tanwar for Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified on 23th November
// Adding Viz given by Shahbaz
////////////////////////////////////////////////////////////////////
var AbandonVehicleApp = Class.extend({

    construct: function () {

        this.gwin = {};


        this.abandonFeatureJson = {};
        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];
        this.abandonedWeekSelection = 0;
        this.abandonedMonthSelection = 0;
        this.abandonedWeekChicago = 0;
        this.abandonedMonthChicago = 0;
        this.abandonedJson = null;
        this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1500;
        this.barCanvasHeight = 500;
        this.abandonedPathWkVar = 0;
        this.abandonedPathMnVar = 0;

        this.barWidth = 0;
        this.barHeight = 0;
        
        this.svgBar = null;
        
        this.myTag = "";
    },
    /////////////////////////////////////////////////////////////

    startup: function (whereToRender)
    {
        console.log('Inside Abandoned Vehicle Startup');
        this.myTag = whereToRender;
        this.updateScreen();
    },
    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.  
    drawBarChart: function (data)
    {
        console.log('Inside drawBarChart');
        ;
       // console.log(data);
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        
        this.updateWindow();
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
            .style("font-size","25pt");

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
           .text("311-Reported Abandoned Vehicles");
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
        document.getElementById('abandonchart').innerHTML = "";
        this.svgBar = d3.select(this.myTag).append("svg:svg")
        .attr("width", this.barWidth)
        .attr("height", this.barHeight)
        .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){    
        console.log('updateData Abandoned Vehicle');
        //var fileToLoad = "App/json/InboundOutboundTrips/max_inbound_outbound_flow.json";
        var abandonedChicago = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC';
            
        var abandonedMonthSelection = this.abandonedMonthSelection;
        var abandonedWeekSelection = this.abandonedWeekSelection;

        var abandonedWeekChicago = 0;
        var abandonedMonthChicago = 0;

        var self = this;
        
        d3.json(
            abandonedChicago, 
            function(err, response)
                {

                    var data1 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

                        var today = new Date();
                        if(d.creation_date != null){

                            d.myDate = parseDate(d.creation_date);

                            d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                            if(d.daysAgo <8) {
                                return d;
                            } 
                        }
                    });

                    abandonedWeekChicago = data1.length; 

                    var data2 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
                       // console.log(d.creation_date);
                        var today = new Date();
                        if(d.creation_date != null){

                            d.myDate = parseDate(d.creation_date);

                            d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                            if (d.daysAgo <31) {
                                return d;   
                            }  
                        }
                    }); 

                    abandonedMonthChicago = data2.length;

                    var abandonedJson = 
                    [
                        { "AreaFocus" : "SelectedArea", "Week" : abandonedWeekSelection, "Month" : abandonedMonthSelection},
                        {"AreaFocus": "Chicago", "Week" : abandonedWeekChicago, "Month" : abandonedMonthChicago }
                    ];

                   // console.log('Abandoned Vehicle Data' +  streetWeekSelection + streetMonthSelection + streetWeekChicago + streetMonthChicago);

                    self.abandonedJson = abandonedJson;

                    self.drawBarChart(abandonedJson);

        });
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){
      
      this.updateData();
    },
////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTION TO GET ABANDONED VEHICLES
////////////////////////////////////////////////////////////////////

    makeCallback: function (abandonVehicleCollection,update) {
        if (!update) {
            var abandonFeatureJson = {};
            mapContainer.abandonSeen = [];   
            mapContainer.abandonWeekSeen = []; 
            mapContainer.abandonMonthSeen = [];      
            // Clear data from the layer
            mapContainer.AbandonLayer.clearLayers();
        }
        var abandonedWeekCounter = 0;
        var abandonedMonthCounter = 0;
        abandonVehicleCollection.forEach(function(d) {

         var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
        if ((!update)  || (window.avc < 5)) {
            mapContainer.abandonSeen.push(d.service_request_number);
            if (d.latitude && d.longitude)
                {
                    if (isNaN(d.latitude))
                        console.log("latitude is not a number");
                    if (isNaN(d.longitude))
                        console.log("longitude is not a number");
                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

                    var today = new Date();
                    d.myDate = parseDate(d.creation_date);
                    
                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373

                    //Getting Custom Message for User based on status of the request
                    if(d.status == 'Open'){
                        d.status_message = 'Travel with Caution!';
                    }
                    else{
                        d.status_message = 'Abandoned Vehicle Removed!';
                    } 

                    if(d.daysAgo < 8){
                         abandonedWeekCounter = abandonedWeekCounter + 1;//CHANGE HERE
                         mapContainer.abandonWeekSeen.push(d.service_request_number);
                            abandonFeatureJson = {
                                "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [d.longitude,d.latitude]
                                    }
                            }

                            // var stationGeoJson = 
                            L.geoJson(abandonFeatureJson, { 
                                pointToLayer: function (feature, latlng) {
                                    
                                    var content = '<P><B> Date Reported: </B>' 
                                                + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
                                                + d.status + '<B><BR> Street: </b>' 
                                                + d.street_address + '<BR><b>'
                                                + d.status_message +  '</b></P>';
                                    //console.log('ABANDON VeHICLE');
                                    var popup = L.popup().setContent(content);

                                    
                                    var oldLeafIcon = L.Icon.extend({
                                        options: {
                                            //shadowUrl: '../docs/images/leaf-shadow.png',
                                            iconSize:     [60, 60],
                                            //shadowSize:   [50, 64],
                                            iconAnchor:   [2, 0],
                                            //shadowAnchor: [4, 62],
                                            popupAnchor:  [0,0],
                                            opacity : 0.2
                                        }
                                    });

                                var olderIcon = new oldLeafIcon({iconUrl: './images/icon-abandoned-vehicle-bright-red.png'});
                                var marker = L.marker(latlng,{icon: olderIcon});
                                    marker.bindPopup(popup);
                                return marker;  
                                
                            }
                        }).addTo(mapContainer.AbandonLayer);
                    }
                    else if(d.daysAgo< 31){
                        abandonedMonthCounter = abandonedMonthCounter + 1;
                        mapContainer.abandonMonthSeen.push(d.service_request_number);
                            abandonFeatureJson = {
                                "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [d.longitude,d.latitude]
                                    }
                            }

                            // var stationGeoJson = 
                            L.geoJson(abandonFeatureJson, { 
                                pointToLayer: function (feature, latlng) {
                                    
                                    var content = '<P><B> Date Reported: </B>' 
                                                + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
                                                + d.status + '<B><BR> Street: </b>' 
                                                + d.street_address + '<BR><b>'
                                                + d.status_message +  '</P></b>';
                                    var popup = L.popup().setContent(content);

                                 /*   var redMarkerOptions = {
                                        radius: 10,
                                        fillColor: "Red",
                                        color: "#000",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.5
                                    };

                                */
                                 var oldLeafIcon = L.Icon.extend({
                                        options: {
                                            //shadowUrl: '../docs/images/leaf-shadow.png',
                                            iconSize:     [60, 60],
                                            //shadowSize:   [50, 64],
                                            iconAnchor:   [2, 0],
                                            //shadowAnchor: [4, 62],
                                            popupAnchor:  [0,0],
                                            opacity : 0.2
                                        }
                                    });

                                var olderIcon = new oldLeafIcon({iconUrl: './images/icon-abandoned-vehicle-bright-w.png'});
                                //var marker = L.circleMarker(latlng, redMarkerOptions);
                                var marker = L.marker(latlng,{icon: olderIcon});
                                    marker.bindPopup(popup);
                                return marker;  
                                    
                            }
                        }).addTo(mapContainer.AbandonLayer);
                    }
            }  
        } else if (mapContainer.abandonSeen.indexOf(d.service_request_number) == -1) {
            mapContainer.abandonSeen.push(d.service_request_number);
            window.updates.push("New abandoned vehicle found at "+d.street_address+" - "+d.type_of_service_request+"<br />");
                        if (d.latitude && d.longitude)
                {
                    if (isNaN(d.latitude))
                        console.log("latitude is not a number");
                    if (isNaN(d.longitude))
                        console.log("longitude is not a number");
                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

                    var today = new Date();
                    d.myDate = parseDate(d.creation_date);
                    
                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373

                    //Getting Custom Message for User based on status of the request
                    if(d.status == 'Open'){
                        d.status_message = 'Travel with Caution!';
                    }
                    else{
                        d.status_message = 'Abandoned Vehicle Removed!';
                    } 

                    if(d.daysAgo < 8){
                        mapContainer.abandonWeekSeen.push(d.service_request_number);
                            abandonFeatureJson = {
                                "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [d.longitude,d.latitude]
                                    }
                            }

                            // var stationGeoJson = 
                            L.geoJson(abandonFeatureJson, { 
                                pointToLayer: function (feature, latlng) {
                                    
                                    var content = '<P><B> Date Reported: </B>' 
                                                + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
                                                + d.status + '<B><BR> Street: </b>' 
                                                + d.street_address + '<BR><b>'
                                                + d.status_message +  '</b></P>';
                                    //console.log('ABANDON VeHICLE');
                                    var popup = L.popup().setContent(content);

                                    
                                    var oldLeafIcon = L.Icon.extend({
                                        options: {
                                            //shadowUrl: '../docs/images/leaf-shadow.png',
                                            iconSize:     [60, 60],
                                            //shadowSize:   [50, 64],
                                            iconAnchor:   [2, 0],
                                            //shadowAnchor: [4, 62],
                                            popupAnchor:  [0,0],
                                            opacity : 0.2
                                        }
                                    });

                                var olderIcon = new oldLeafIcon({iconUrl: './images/icon-abandoned-vehicle-bright-red.png'});
                                var marker = L.marker(latlng,{icon: olderIcon});
                                    marker.bindPopup(popup);
                                return marker;  
                                
                            }
                        }).addTo(mapContainer.AbandonLayer);
                    }
                    else if(d.daysAgo< 31){
                        mapContainer.abandonWeekSeen.push(d.service_request_number);
                            abandonFeatureJson = {
                                "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [d.longitude,d.latitude]
                                    }
                            }

                            // var stationGeoJson = 
                            L.geoJson(abandonFeatureJson, { 
                                pointToLayer: function (feature, latlng) {
                                    
                                    var content = '<P><B> Date Reported: </B>' 
                                                + moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
                                                + d.status + '<B><BR> Street: </b>' 
                                                + d.street_address + '<BR><b>'
                                                + d.status_message +  '</P></b>';
                                    var popup = L.popup().setContent(content);

                           var oldLeafIcon = L.Icon.extend({
                                        options: {
                                            //shadowUrl: '../docs/images/leaf-shadow.png',
                                            iconSize:     [60, 60],
                                            //shadowSize:   [50, 64],
                                            iconAnchor:   [2, 0],
                                            //shadowAnchor: [4, 62],
                                            popupAnchor:  [0,0],
                                            opacity : 0.2
                                        }
                                    });

                                var olderIcon = new oldLeafIcon({iconUrl: './images/icon-abandoned-vehicle-bright-w.png'});
                                var marker = L.marker(latlng,{icon: olderIcon});
                                    marker.bindPopup(popup);
                                return marker;  
                                    
                            }
                        }).addTo(mapContainer.AbandonLayer);
                    }
            }  
            }
        });
        this.abandonedWeekSelection = abandonedWeekCounter;
        this.abandonedMonthSelection = abandonedMonthCounter;

        if(mapContainer.mode =='Path'){
            console.log('Inside Path Mode for Pthole + mapContainer.iterator  : ' + mapContainer.iterator);
            if(mapContainer.iterator == 'XX'){
                this.abandonedPathWkVar = 0;
                this.abandonedPathMnVar = 0;
            }
            this.abandonedPathWkVar = this.abandonedPathWkVar + abandonedWeekCounter;
            this.abandonedPathMnVar = this.abandonedPathWkVar + abandonedMonthCounter;
            this.abandonedWeekSelection = this.abandonedPathWkVar ;
            this.potMonthSelection = this.abandonedPathMnVar;
            console.log('potWeekCounter :'  + abandonedWeekCounter);
            console.log('potMonthCounter :'  + abandonedMonthCounter);
            console.log('Path Mode Week Potholes : ' + this.abandonedWeekSelection );
            console.log('Path Mode month Potholes'  + this.abandonedMonthSelection);
            mapContainer.iterator = 'YY'; 
            console.log('After YY'  + mapContainer.iterator);
        }
                    
            
            this.startup('#abandonchart');
    },

////////////////////////////////////////////////////////////////////
// ABANDON LAYER CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////   

    abandonLayerFunc: function (marLat1,marLng1,marLat2,marLng2,update)  {

        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;

 

        var self = this;

        var zipCode = this.marLat1 + ',' + this.marLng1 + ',' + this.marLat2  + ',' +  this.marLng2 + ')';

        var bracket = ")";

        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location,".concat(zipCode);
            query = query + '&$order=creation_date%20DESC';
        //'https://data.cityofchicago.org/resource/zuxi-7xem.json?zip_code='.concat(zipCode);
        //'http://data.cityofchicago.org/resource/7as2-ds3y.json?zip='.concat(zipCode);

        console.log('ABANDONED VEHICLES ' +  query);
        d3.json(
            query, 
            function(err, response)
                {
                if(err)
                    {
                        console.log("NO DATA at " + this.marLat1 + " " + this.marLng1 + " " + this.marLat2 + " "  + this.marLng2);
                        return;
                    }
                    self.makeCallbackFunc(response,update);
                });
    },

    ////////////////////////////////////////////////////////
    //  ABANDONED VEHICLE FOR POLYLINE ROUTE MODE
    ///////////////////////////////////////////////////////

    abandonPolylineLayerFunc: function (lat,lng,update) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;

        // Clear previous data from the layer

        

        //var lat = 41.8739580629, 
        //    lon = -87.6277394859;

        var self = this;

        // Taking Location and 500 metre distance around it
        var zipCode = this.marPolyLat + ',' + this.marPolyLng + ',' +'500' + ')';

        var bracket = ")";

        var query = "https://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_circle(location,".concat(zipCode);
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
                    console.log("NO DATA at " + lat + " " + lon);
                    return;
                    }
                    self.makeCallbackFunc(response,update);
                });

    },

    ////////////////////////////////////////////////////////
    //  INITIALIZE METHOD FOR ABANDONED VEHICLE
    ///////////////////////////////////////////////////////

    init: function () {

        this.makeCallbackFunc = this.makeCallback.bind(this);
       
    }

});
