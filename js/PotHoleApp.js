////////////////////////////////////////////////////////////////////
// by Sharad Tanwar for Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified on 6th November
// Creating Pot Hole Variables
////////////////////////////////////////////////////////////////////

var PotHoleApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.potHoleFeatureJson = {};

        //
        // Initializing local variables
        //
        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];
        this.busroutes1 = [];
        this.potWeekSelection = 0;
        this.potMonthSelection = 0;
        this.potWeekChicago = null;
        this.potMonthChicago = null;
        this.potPathWkVar = 0;
        this.potPathMnVar = 0;
        this.PotHoleJson = null;
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
        //console.log('Inside Startup');
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
          .attr("dy", "1em")
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
           .text("311-Reported Potholes");
        
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function () {
        var xWin, yWin;
        
        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;
        
        var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;
		document.getElementById('barchart').innerHTML = "";
        this.svgBar = d3.select(this.myTag).append("svg:svg")
        .attr("width", this.barWidth)
        .attr("height", this.barHeight)
        .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){    

        //var fileToLoad = "App/json/InboundOutboundTrips/max_inbound_outbound_flow.json";
        var potHoleChicago = 'https://data.cityofchicago.org/resource/7as2-ds3y.json?&$order=creation_date%20DESC';
        
        var potMonthSelection = this.potMonthSelection;
        var potWeekSelection = this.potWeekSelection;

        var potWeekChicago = 0;
        var potMonthChicago = 0;
        var self = this;
        //var PotHoleJson;
        d3.json(
            potHoleChicago, 
            function(err, response)
                {

                    var data1 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

                        var today = new Date();

                        d.myDate = parseDate(d.creation_date);

                        d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                        if(d.daysAgo <8) {
                            return d;
                        }
                    });

                    potWeekChicago = data1.length; 

                    var data2 = response.filter(function(d,i){

                        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

                        var today = new Date();

                        d.myDate = parseDate(d.creation_date);

                        d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24;

                        if (d.daysAgo <31) {
                            return d;   
                        }
                    }); 

                    potMonthChicago = data2.length;



                    var PotHoleJson = 
                    [
                        { "AreaFocus" : "SelectedArea", "Week" : mapContainer.potholesWeekSeen.length, "Month" : mapContainer.potholesMonthSeen.length},
                        {"AreaFocus": "Chicago", "Week" : potWeekChicago, "Month" : potMonthChicago }
                    ];

                    console.log('Pot Hole Data' +  potWeekSelection + potMonthSelection + potWeekChicago + potMonthChicago);

                    self.PotHoleJson = PotHoleJson;

                    self.drawBarChart(PotHoleJson);

        });
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){

      this.updateData();
    },
    ////////////////////////////////////////////////////////////
    //   CALLBACK FUNCTION TO ADD TO POTHOLE LAYER
    ///////////////////////////////////////////////////////////

    makeCallback: function (potHoleCollection,update) {
        if (!update) {
          var potHoleFeatureJson ={};
          mapContainer.potholesSeen = [];
          mapContainer.potholesWeekSeen = [];
          mapContainer.potholesMonthSeen = [];
          //console.log("creating potholes seen");
		}
		var potWeekCounter = 0;
		var potMonthCounter = 0;
		
        potHoleCollection.forEach(function(d) {
			var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
			if ((!update) || (window.pc < 5)) {
				console.log("pushing on first run");
				mapContainer.potholesSeen.push(d.service_request_number);
				
				if (isNaN(d.latitude))
					console.log("latitude is not a number");
				if (isNaN(d.longitude))
					console.log("longitude is not a number");

				d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

				var today = new Date();

				d.myDate = parseDate(d.creation_date);

				d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; 

				if(d.status == 'Open'){
					d.status_message = 'Travel with Caution!';
				}
				else{
					d.status_message = 'Pothole Filled! Happy Driving!';
				} 

				if (d.daysAgo <8){
					//this.potWeekCounter= this.potWeekCounter + 1;
                    mapContainer.potholesWeekSeen.push(d.service_request_number);
					potWeekCounter = potWeekCounter + 1;
						potHoleFeatureJson = {
								"type": "Feature",
									"properties": {},
									"geometry": {
										"type": "Point",
										"coordinates": [d.longitude,d.latitude]
									}
							}

						L.geoJson(potHoleFeatureJson, { 
							pointToLayer: function (feature, latlng) {
								
								var content = '<b><center><u>Pothole Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
											+ moment(d.myDate).format("MMM Do YYYY") + '<br /><B> Status: </B>' 
											+ d.status + '<B><BR> Street:</b> ' 
											+ d.street_address + '<BR><b>'
											+ d.status_message +  '</P></b>';
								var popup = L.popup().setContent(content);

								var newLeafIcon = L.Icon.extend({
									options: {
										//shadowUrl: 'images/marker-shadow.png',
										iconSize:     [25, 25],
										//shadowSize:   [50, 64],
										iconAnchor:   [12, 25],
										shadowAnchor: [4, 62],
										popupAnchor:  [-3, -40],
										opacity: 1
									}
								});

								this.newerIcon = new newLeafIcon({iconUrl: './images/Pothole_red.png'});

								var marker = L.marker(latlng, {icon: this.newerIcon} );
									marker.bindPopup(popup);
								return marker;  
									
						}
					}).addTo(mapContainer.PotHolesLayer);
				}
				else if (d.daysAgo < 31){
					//console.log('d.daysAgo for pothholes'  +d.daysAgo);
                    mapContainer.potholesMonthSeen.push(d.service_request_number);
					potMonthCounter = potMonthCounter + 1;
					potHoleFeatureJson = {
								"type": "Feature",
									"properties": {},
									"geometry": {
										"type": "Point",
										"coordinates": [d.longitude,d.latitude]
									}
							}

					L.geoJson(potHoleFeatureJson, { 
						pointToLayer: function (feature, latlng) {
							
							var content = '<b><center><u>Pothole Card</u></center></b>'
                                        + '<P><B>Date Reported:</B> ' 
                                        + moment(d.myDate).format("MMM Do YYYY") + '<br><B>Status: </B>' 
										+ d.status + '<B><BR> Street:</b> ' 
                                        + d.street_address + '<BR><b>'
										+ d.status_message +  '</P></b>';

							var popup = L.popup().setContent(content);

							var oldLeafIcon = L.Icon.extend({
								options: {
									iconSize:     [25, 25],
									//shadowSize:   [50, 64],
									iconAnchor:   [12, 25],
									shadowAnchor: [4, 62],
									popupAnchor:  [-3, -40],
									opacity : 0.2
								}
							});

					var olderIcon = new oldLeafIcon({iconUrl: './images/potHoleIcon.png'});
									var marker = L.marker(latlng,{icon: olderIcon});
										marker.bindPopup(popup);
									return marker;  
									}
								}).addTo(mapContainer.PotHolesLayer);

                }
            
			} else if (mapContainer.potholesSeen.indexOf(d.service_request_number) == -1) {
				mapContainer.potholesSeen.push(d.service_request_number);
				window.updates.push("New pothole data found at "+d.street_address+" - "+d.type_of_service_request+"<br />");
				if (isNaN(d.latitude))
					console.log("latitude is not a number");
				if (isNaN(d.longitude))
					console.log("longitude is not a number");

				d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

				var today = new Date();

				d.myDate = parseDate(d.creation_date);

				d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; 

				if(d.status == 'Open'){
					d.status_message = 'Travel with Caution!';
				}
				else{
					d.status_message = 'Pothole Filled! Happy Driving!';
				} 

			   //  d.myDate = d.myDate.getDay() + ' , ' + d.myDate.getMonth() + ' - ' + d.myDate.getDate() + ' - ' + d.myDate.getYear();

			   // d.myDate = new Date(d.myDate);
				if (d.daysAgo <8){
                    mapContainer.potholesWeekSeen.push(d.service_request_number);
                    
						potHoleFeatureJson = {
								"type": "Feature",
									"properties": {},
									"geometry": {
										"type": "Point",
										"coordinates": [d.longitude,d.latitude]
									}
							}

						L.geoJson(potHoleFeatureJson, { 
							pointToLayer: function (feature, latlng) {
								
								var content = '<b><center><u>Pothole Card</u></center></b>'
                                            + '<P><B> Date Reported: </B>' 
											+ moment(d.myDate).format('MMM Do YYYY') + '<br /><B> Status: </B>' 
											+ d.status + '<B><BR> Street:</b> ' 
											+ d.street_address + '<BR>'
											+ d.status_message +  '</P>';
								var popup = L.popup().setContent(content);

								var newLeafIcon = L.Icon.extend({
									options: {
										//shadowUrl: 'images/marker-shadow.png',
										iconSize:     [50, 50],
										//shadowSize:   [50, 64],
										iconAnchor:   [12, 25],
										shadowAnchor: [4, 62],
										popupAnchor:  [-3, -40],
										opacity: 1
									}
								});

								this.newerIcon = new newLeafIcon({iconUrl: './images/Pothole_red.png'});

								var marker = L.marker(latlng, {icon: this.newerIcon} );
									marker.bindPopup(popup);
								return marker;  
									
						}
					}).addTo(mapContainer.PotHolesLayer);
				}
				else if (d.daysAgo < 31){
					//console.log('d.daysAgo for pothholes'  +d.daysAgo);
                    mapContainer.potholesMonthSeen.push(d.service_request_number);
					potHoleFeatureJson = {
								"type": "Feature",
									"properties": {},
									"geometry": {
										"type": "Point",
										"coordinates": [d.longitude,d.latitude]
									}
							}

					L.geoJson(potHoleFeatureJson, { 
						pointToLayer: function (feature, latlng) {
							
							var content = '<b><center><u>Pothole Card</u></center></b>'
                                        + '<P><B> Reporting Date : <BR></B>' 
                                        + d.myDate + '<br><B> Status: </B>' 
										+ d.status + '<B><BR> Street:</b> ' 
                                        + d.street_address + '<BR><b>'
										+ d.status_message +  '</P>';
							var popup = L.popup().setContent(content);

							var oldLeafIcon = L.Icon.extend({
								options: {
									iconSize:     [50, 50],
									//shadowSize:   [50, 64],
									iconAnchor:   [12, 25],
									shadowAnchor: [4, 62],
									popupAnchor:  [-3, -40],
									opacity : 0.2
								}
							});

					var olderIcon = new oldLeafIcon({iconUrl: './images/potHoleIcon.png'});
									var marker = L.marker(latlng,{icon: olderIcon});
										marker.bindPopup(popup);
									return marker;  
									}
								}).addTo(mapContainer.PotHolesLayer);
                }
	        }
        });

        this.potWeekSelection = potWeekCounter;
        this.potMonthSelection = potMonthCounter;
        if(mapContainer.mode =='Path'){
            console.log('Inside Path Mode for Pthole + mapContainer.iterator  : ' + mapContainer.iterator);
            if(mapContainer.iterator == 'XX'){
                this.potPathWkVar = 0;
                this.potPathMnVar = 0;
            }
            this.potPathWkVar = this.potPathWkVar + potWeekCounter;
            this.potPathMnVar = this.potPathWkVar + potMonthCounter;
            this.potWeekSelection = this.potPathWkVar ;
            this.potMonthSelection = this.potPathMnVar;
            console.log('potWeekCounter :'  + potWeekCounter);
            console.log('potMonthCounter :'  + potMonthCounter);
            console.log('Path Mode Week Potholes : ' + this.potWeekSelection );
            console.log('Path Mode month Potholes'  + this.potMonthSelection);
            mapContainer.iterator = 'YY'; 
            console.log('After YY'  + mapContainer.iterator);
        }
        
        
        this.startup('#barchart');

    },

    ////////////////////////////////////////////////////////
    // Creating Icons to be used
    ///////////////////////////////////////////////////////
    iconCreationFunc: function(){

        var LeafIcon = L.Icon.extend({
            options: {
                //shadowUrl: '../docs/images/leaf-shadow.png',
                iconSize:     [38, 95],
                shadowSize:   [50, 64],
                iconAnchor:   [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor:  [-3, -76]
            }
        });

        this.greenIcon = new LeafIcon({iconUrl: './images/potHoleIcon.png'});
    },

    ////////////////////////////////////////////////////////
    //  POTHOLE CALLBACK FOR POLYGON BOX VIEW
    ///////////////////////////////////////////////////////

    potHoleLayerFunc: function (marLat1,marLng1,marLat2,marLng2,update) {

        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;
        if (!update) {
			mapContainer.PotHolesLayer.clearLayers(); 
		}
        //Getting the temperature
        //console.log('inside potHoleLayerFunc');
        var lat = 41.8739580629, 
            lon = -87.6277394859;

        var self = this;

        var zipCode=this.marLat1 + ',' + this.marLng1 + ',' + this.marLat2  + ',' +  this.marLng2 + ')';

        var bracket = ")";

        //var query = "https://data.cityofchicago.org/resource/7as2-ds3y.json?$order=creation_date%20DESC&zip=".concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location,".concat(zipCode);
            query = query + '&$order=creation_date%20DESC';

            console.log(query);
        //60607
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

    ////////////////////////////////////////////////////////
    //  POTHOLE CALLBACK FOR POLYLINE ROUTE MODE
    ///////////////////////////////////////////////////////

    potHolePolylineLayerFunc: function(lat,lng,update){
        this.marPolyLat = lat;
        this.marPolyLng = lng;
        if (!update) {
			mapContainer.PotHolesLayer.clearLayers(); 
            mapContainer.iterator = 'XX';
		}
        //Getting the temperature
        //console.log('inside potHolePolylineLayerFunc');
        var lat = 41.8739580629, 
            lon = -87.6277394859;

        var self = this;

        // Taking Location and 500 metre distance around it
        var zipCode = this.marPolyLat + ',' + this.marPolyLng + ',' +'500' + ')';

        var bracket = ")";

        // Query Call to get PotHole Data
        //var query = "https://data.cityofchicago.org/resource/7as2-ds3y.json?$order=creation_date%20DESC&zip=".concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_circle(location,".concat(zipCode);
            //https://soda.demo.socrata.com/resource/earthquakes.json?$where=within_circle(location, 47.616810, -122.328064, 50000)
            query = query + '&$order=creation_date%20DESC';

            console.log(query);
        
        // Using D3 json function to create json data
        d3.json(
            query, 
            function(err, response)
                {
                if(err)
                    {
                    console.log("NO DATA at " + this.marPolyLat + " " + this.marPolyLng);
                    return;
                    }
                    self.makeCallbackFunc(response,update);
                });

    },
    ////////////////////////////////////////////////////////////
    //   OVERALL CHICAGO
    ///////////////////////////////////////////////////////////

    callChicagoData: function(){
        
        var recentCrimeChicago = 'https://data.cityofchicago.org/resource/x2n5-8w5q.json?&$order=date_of_occurrence%20DESC';
        var restaurantChicago = 'https://data.cityofchicago.org/resource/uupf-x98q.json?&$order=license_start_date%20DESC';
        var restPOIChicago = 'https://data.cityofchicago.org/resource/4ijn-s7e5.json?&$order=inspection_date%20DESC';
        var abandonVehicleChicago = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?&$order=creation_date%20DESC';
        var streetLightChicago = 'https://data.cityofchicago.org/resource/zuxi-7xem.json?&$order=creation_date%20DESC';

         //this.potWeekSelection = weekCounter;
         //this.potMonthSelection = monthCounter;


    },
    ////////////////////////////////////////////////////////
    //  INITIALIZE FUNCTION FOR POTHOLE
    ///////////////////////////////////////////////////////

    init: function () {


        this.makeCallbackFunc = this.makeCallback.bind(this);

        //this.loadInIcons();
        //this.updateOutsideTemp();
       // this.iconCreationFunc();
    }

});
