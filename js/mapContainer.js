///////////////////////////////////////////////////////
// by Sharad Tanwar for Project 3 Group 6 : Right Here!! Right Now!!
//////////////////////////////////////////////////////
var mapContainer = Class.extend({

    construct: function() {
    /////////////////////////////////////////////////////////
    // Calling global variables to be used in functions
    ////////////////////////////////////////////////////////
        this.map = null;
        this.MapView = null;
        this.Aerial = null;
        this.polyline;
        this.svg = null;
        this.polyline = null;
        this.coordinates = null;
        this.Polygon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.custlatlng2 = null;
        this.custlatlng1 = null;
        this.Router = null;
        this.mode = null; // Added to see which mode is the UI running on.
        this.iterator = 'XX';
        this.waypoints = [];
        this.markerArray = [];
        this.potholeRefreshInt = 30000;
        this.busRefreshInt = 3000;
        this.tickerRefreshInt = 5000;
        this.divvyRefreshInt = 10000;
        this.abandonRefreshInt = 30000;
        this.crimeRefreshInt = 30000;
        this.streetlightRefreshInt = 30000;
    ////////////////////////////////////////////////////////////
    //   DEFINING MAP VIEWS TO SHOW AS BASE LAYERS
    ///////////////////////////////////////////////////////////

        this.mapURL1 = 'https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png';
        this.mapCopyright1 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

        this.mapURL2 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        this.mapCopyright2 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX';

        this.mapURL3 = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.mapCopyright3 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

    ////////////////////////////////////////////////////////////
    //   DEFINING DIFFERENT BASE LAYERS
    ///////////////////////////////////////////////////////////

        this.Aerial = L.tileLayer(this.mapURL1, {attribution: this.mapCopyright1});
        this.MapView = L.tileLayer(this.mapURL2, {attribution: this.mapCopyright2});
        this.ColorView = L.tileLayer(this.mapURL3, {attribution: this.mapCopyright3});

    ////////////////////////////////////////////////////////////
    //   INITIALIZING OVERLAYS
    ///////////////////////////////////////////////////////////
        this.AbandonLayer           = new L.LayerGroup(); // Abandoned Vehicles
        this.StreetLightLayer       = new L.LayerGroup(); // Street Lights Out
        this.PotHolesLayer          = new L.LayerGroup(); // Pot Holes
        this.DivvyStationLayer      = new L.LayerGroup(); // Divvy Station Layer
        this.RecentCrimeLayer       = new L.LayerGroup(); // Recent Crime Layer
        this.RestPOILayer           = new L.LayerGroup(); // Food Inspection
        this.RestaurantLayer        = new L.LayerGroup(); // Active Restaurants
        this.CTATrackerLayer        = new L.LayerGroup(); // Active Restaurants
    },
    ////////////////////////////////////////////////////////////
    //   FUNCTION CALL TO GET CURRENT WEATHER DATA
    ///////////////////////////////////////////////////////////
    //~ weatherDiv: function(){
//~ 
        //~ usweatherApp.updateOutsideTemp();
    //~ 
    //~ },

    ////////////////////////////////////////////////////////////
    //   FUNCTION CALL TO GET POTHOLE DATA BASED ON TWO DISTINCT POINTS
    ///////////////////////////////////////////////////////////
    
    getPolygonDataFunc: function(){

        console.log('INSIDE getPolygonDataFunc');
        // Function to create a polygon
        this.createPolygonFunc();
        // Function call for Polygon Data
        // Pothole
        potHoleApp.potHoleLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2,false);
        // Abandon Vehicle
        abandonVehicleApp.abandonLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2,false);
        // Street Lights
        streetLightApp.streetLightLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2,false);
        // Recent Crime
        recentCrimeApp.recentCrimeLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2,false);
        // Food Inspection
        restPOIApp.restPOILayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2);
        // Restaurants
        restaurantApp.restaurantLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2);
        // Divvy
        divvyApp.divvyLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2,false);
        // 
        ctaTrackerApp.ctaTrackerLayerFunc(this.marLat1,this.marLng1,this.marLat2,this.marLng2);
        
        
        //////////////////////////////////////////////////////////
        // HERE WE FIRE REFRESH EVENTS
        //////////////////////////////////////////////////////////
        window.currentBox = new Array(this.marLat1,this.marLng1,this.marLat2,this.marLng2);
        tickerLoop = setInterval(function() {
          ourHtml = ""
          if (window.updates.length == 0) {
            ourHtml = moment().format("HH:mm:ss")+" -- No new updates since "+window.lastupdate.format("HH:mm:ss");
            if (window.lastupdatehtml) {
              ourHtml+="<br/><br/>Last Update:<br/>"+window.lastupdatehtml;
            }
          } else {
			window.lastupdate = moment();
            for (i=0; i<window.updates.length; i++) {
              ourHtml += window.updates[i];
            }
            window.updates = [];
            window.lastupdatehtml = ourHtml;
          }
          if (d3.select("#ticker").style("display") == "none") {
            $("#ticker").toggle("slide");
          }
          d3.select("#ticker").html(ourHtml);
        }, this.tickerRefreshInt);
        window.pc = 0;
        potholeLoop = setInterval(function() {
          potHoleApp.potHoleLayerFunc(window.currentBox[0],window.currentBox[1],window.currentBox[2],window.currentBox[3],true);
          window.pc++;
        }, this.potholeRefreshInt);
        busLoop = setInterval(function() {
          ctaTrackerApp.ctaTrackerLayerFunc(window.currentBox[0],window.currentBox[1],window.currentBox[2],window.currentBox[3]);
        }, this.busRefreshInt);
        divvyLoop = setInterval(function() {
          divvyApp.divvyLayerFunc(window.currentBox[0],window.currentBox[1],window.currentBox[2],window.currentBox[3], true);
        }, this.divvyRefreshInt);
        window.avc = 0;
        abandonLoop = setInterval(function() {
          abandonVehicleApp.abandonLayerFunc(window.currentBox[0],window.currentBox[1],window.currentBox[2],window.currentBox[3], true);
          window.avc++;
        }, this.abandonRefreshInt);
        window.cc = 0;
        crimeLoop = setInterval(function() {
		  recentCrimeApp.recentCrimeLayerFunc(window.currentBox[0],window.currentBox[1],window.currentBox[2],window.currentBox[3], true);
	      window.cc++;
		}, this.crimeRefreshInt);
		window.sc = 0;
		streetlightLoop = setInterval(function() {
		  streetLightApp.streetLightLayerFunc(window.currentBox[0],window.currentBox[1],window.currentBox[2],window.currentBox[3], true);
		  window.sc++;
		}, this.streetlightRefreshInt);
        toggleLayer('PotHolesLayer');

    },

    ////////////////////////////////////////////////////////////
    //   Create Polygon to show data between two points
    ///////////////////////////////////////////////////////////

    createPolygonFunc: function(){

        if(this.Polygon!=null){
            this.map.removeLayer(this.Polygon);
        }

        this.Polygon =  L.polygon(
                    [
                        [this.marLat2,this.marLng1],
                        [this.marLat1,this.marLng1],
                        [this.marLat1,this.marLng2],
                        [this.marLat2,this.marLng2]
                    ],
                    {
                        color: 'red',
                        weight: 10,
                        opacity: .7,
                        dashArray: '20,15',
                        lineJoin: 'round'
                    }).addTo(mapContainer.map);

    },

    ////////////////////////////////////////////////////////////
    //   FUNCTION CALL TO GET POTHOLE DATA BASED ON TWO DISTINCT POINTS
    ///////////////////////////////////////////////////////////
/*    
    potHoleFunc: function(marLat1,marLng1,marLat2,marLng2){

        potHoleApp.potHoleLayerFunc(marLat1,marLng1,marLat2,marLng2);

    },
*/
    ////////////////////////////////////////////////////////////
    //   INIT FUNCTION CALL FOR STREET LIGHT
    ///////////////////////////////////////////////////////////
    streetLightLayerFunc: function(){

        streetLightApp.streetLightLayerFunc();

    },

    ////////////////////////////////////////////////////////////
    //   INIT FUNCTION CALL FOR ABANDON VEHICLE
    ///////////////////////////////////////////////////////////

    abandonVehicleLayerFunc: function(){

        abandonVehicleApp.abandonLayerFunc();

    },

    ////////////////////////////////////////////////////////////
    //   INIT FUNCTION CALL FOR RECENT CRIME
    ///////////////////////////////////////////////////////////

    recentCrimeLayerFunc: function(){

        recentCrimeApp.recentCrimeLayerFunc();

    },
    
    divvyLayerFunc: function() {
		divvyApp.divvyLayerFunc();
	},

    ////////////////////////////////////////////////////////////
    //   FUNCTION CALL TO GET POLYLINE DATA FROM ALL SOURCES
    ///////////////////////////////////////////////////////////

    getPolyLineFunc: function(lat,lng){
        if (window.started) {
		  clearAllLayers();
		}
		window.started = true;
        // Added Code for calculating waypoints from the route
        var marArray =[];
        wayPoints = [];
        // Total Distance of Path plotted.
        var totalDistance = this.Router._line._route.summary.totalDistance;
        //console.log('totalDistance ' + totalDistance);

        // Radius of each waypoint * 2 = Diameter
        var diameter = 1000;

        var wayPointLength = Math.round(totalDistance/diameter);

        //console.log('wayPointLength ' + wayPointLength);

        var ArrayLength = this.Router._line._route.coordinates;

        //console.log('ArrayLength ' + ArrayLength);

        var markerCall =Math.round( (ArrayLength.length/wayPointLength) )+ 1;
        //console.log(markerCall);
        var j =0 ;
        this.iterator = 'XX'; 
        console.log('Iterator in MapContainter' + this.iterator);
		window.currentEnds = []
        for (var i=0; i < ArrayLength.length; i = i + markerCall){
            wayPoints[i] = this.Router._line._route.coordinates[i];
            
                // WayPoint Check
                //marArray[i] =  L.marker([wayPoints[i][0],wayPoints[i][1]]).addTo(this.map);
				window.currentEnds.push([wayPoints[i][0], wayPoints[i][1]]);
                this.markerArray[j] = marArray[i];
                j= j+ 1;

                console.log('i --> ' + i + 'Array -->'  + this.markerArray[i]);
                // Pothole
                potHoleApp.potHolePolylineLayerFunc(wayPoints[i][0],wayPoints[i][1],false);
                // Abandon Vehicle
                abandonVehicleApp.abandonPolylineLayerFunc(wayPoints[i][0],wayPoints[i][1],false);
                // Street Light
                streetLightApp.streetLightPolylineLayerFunc(wayPoints[i][0],wayPoints[i][1],false);
                // Recent Crime
                recentCrimeApp.recentCrimePolylineLayerFunc(wayPoints[i][0],wayPoints[i][1],false);
                // Food Inspection
                restPOIApp.restPOIPolylineLayerFunc(wayPoints[i][0],wayPoints[i][1]);
                // Restaurants
                restaurantApp.restaurantPolylineLayerFunc(wayPoints[i][0],wayPoints[i][1]);
                // Divvy 
                divvyApp.divvyPolylineLayerFunc(wayPoints[i][0],wayPoints[i][1],false);
                // CTA
                ctaTrackerApp.ctaPolylineLayerFunc(wayPoints[i][0],wayPoints[i][1]);
        }
        //////////////////////////////////////////////////////////
        // HERE WE FIRE REFRESH EVENTS
        //////////////////////////////////////////////////////////
        tickerLoop = setInterval(function() {
          ourHtml = ""
          if (window.updates.length == 0) {
            ourHtml = moment().format("HH:mm:ss")+" -- No new updates since "+window.lastupdate.format("HH:mm:ss");
            if (window.lastupdatehtml) {
              ourHtml+="<br/><br/>Last Update:<br/>"+window.lastupdatehtml;
            }
          } else {
			window.lastupdate = moment();
            for (i=0; i<window.updates.length; i++) {
              ourHtml += window.updates[i];
            }
            window.updates = [];
            window.lastupdatehtml = ourHtml;
          }
          if (d3.select("#ticker").style("display") == "none") {
            $("#ticker").toggle("slide");
          }
          d3.select("#ticker").html(ourHtml);
        }, this.tickerRefreshInt);
        window.pc = 0;
        potholeLoop = setInterval(function() {
          for (i = 0; i< window.currentEnds.length; i++) {
            potHoleApp.iterator = 'XX';
            potHoleApp.potHolePolylineLayerFunc(window.currentEnds[i][0],window.currentEnds[i][1],true);
            }
            window.pc++;
        }, this.potholeRefreshInt);
        busLoop = setInterval(function() {
          for (i = 0; i< window.currentEnds.length; i++) {
          ctaTrackerApp.ctaPolylineLayerFunc(window.currentEnds[i][0],window.currentEnds[i][1]);
          }
        }, this.busRefreshInt);
        divvyLoop = setInterval(function() {
                  for (i = 0; i< window.currentEnds.length; i++) {
          divvyApp.divvyPolylineLayerFunc(window.currentEnds[i][0],window.currentEnds[i][1],true);
          }
        }, this.divvyRefreshInt);
        window.avc = 0;
        abandonLoop = setInterval(function() {
			for (i=0; i<window.currentEnds.length; i++) {
				abandonVehicleApp.abandonPolylineLayerFunc(window.currentEnds[i][0],window.currentEnds[i][1],true);
			}
			window.avc++;
		}, this.abandonRefreshInt);
		window.cc = 0;
		crimeLoop = setInterval(function() {
		  for (i=0; i<window.currentEnds.length; i++) {
				recentCrimeApp.recentCrimePolylineLayerFunc(window.currentEnds[i][0],window.currentEnds[i][1],true);
		   }
		   window.cc++;
		}, this.crimeRefreshInt);
		window.sc = 0;
		streetlightLoop = setInterval(function() {
		  for (i=0; i<window.currentEnds.length; i++) {
                    this.iterator = 'XX';
				streetLightApp.streetLightPolylineLayerFunc(window.currentEnds[i][0],window.currentEnds[i][1],true);
		   }
		   window.sc++;
		}, this.streetlightRefreshInt);
		//this.polyline.on("waypointschanged", alert("linetouched, man"));
		
		toggleLayer('PotHolesLayer');        


        /*var points = mapContainer.polyline.getWaypoints();

        console.log('points ' + points);

        for(var i = 0; i < points.length; i++) {
            //Polyline Array
            var point = points[i];
            //Getting Coordinates

            var coordinate = point.latLng;
            //Passing Lat and Lng for each coordinates
            // Pothole
            potHoleApp.potHolePolylineLayerFunc(coordinate.lat, coordinate.lng);
            // Abandon Vehicle
            abandonVehicleApp.abandonPolylineLayerFunc(coordinate.lat, coordinate.lng);
            // Street Light
            streetLightApp.streetLightPolylineLayerFunc(coordinate.lat, coordinate.lng);
            // Recent Crime
            recentCrimeApp.recentCrimePolylineLayerFunc(coordinate.lat, coordinate.lng);
            // Food Inspection
            restPOIApp.restPOIPolylineLayerFunc(coordinate.lat,coordinate.lng);
            // Restaurants
            restaurantApp.restaurantPolylineLayerFunc(coordinate.lat,coordinate.lng);
            // Divvy 
            divvyApp.divvyPolylineLayerFunc(coordinate.lat,coordinate.lng);
        }
        */


    },

    ////////////////////////////////////////////////////////////
    //   CREATING DEFAULT POLYLINE
    ///////////////////////////////////////////////////////////

    createPolyLine: function(){
        // Add more markers..atleast 10 to run query on
       /* Commented by Sharad to accomodate generalization to waypoints -- 12th Nov
       this.coordinates =  [ L.latLng(41.869928338428736,-87.65652179718016),
                              L.latLng(41.87056748371651,-87.6492691040039) ];
        */

        //var polyControl;
        this.coordinates = [ L.latLng(this.marLat1,this.marLng1),
                              L.latLng(this.marLat2,this.marLng2) ];

        this.polyline = L.Routing.control({
			waypoints: this.coordinates,
			fitSelectedRoutes: false
	    }).addTo(this.map);
		//this.polyline.on("linetouched", alert("reroute"));
        // Add a new waypoint before the current waypoints
        this.Router = this.polyline;
        //var Router = this.Router;


    },

    ////////////////////////////////////////////////////////////
    //   ADDING BASE LAYERS
    ///////////////////////////////////////////////////////////
    layerOverview: function (){

             this.baseLayers = {
                "ColorView": this.ColorView,
                "MapView": this.MapView,
                "Aerial": this.Aerial
            };
    ////////////////////////////////////////////////////////////
    //   DEFINING VARIOUS LAYERS TO SHOW ON MAP
    ///////////////////////////////////////////////////////////

        this.baseLayerOverview();

    },
    
    ////////////////////////////////////////////////////////////
    //   ADDING OVERLAYS TO BASE LAYERS
    ///////////////////////////////////////////////////////////
    baseLayerOverview: function(){

          this.overlayMaps = {
                "Abandoned Vehicles"    : this.AbandonLayer,
                "Street Lights"         : this.StreetLightLayer,
                "Pot Holes"             : this.PotHolesLayer,
                "Divvy Bike Stands"     : this.DivvyStationLayer,
                "Recent Crime"          : this.RecentCrimeLayer,
                "Food Inspections"      : this.RestPOILayer,
                "Active POI"            : this.RestaurantLayer,
                "CTA Bus"               : this.CTATrackerLayer
            };

            ////////////////////////////////////////////////////////////
            //   ADDING DIFFERENT CONTROLS TO THE MAP
            ///////////////////////////////////////////////////////////
            L.control.scale().addTo(this.map);
            //L.control.layers(this.baseLayers, this.overlayMaps, {position: 'bottomleft', collapsed: false}).addTo(this.map);
            //L.control.sidebar('sidebar-right', { position: 'right' }).addTo(this.map);

    },
    ////////////////////////////////////////////////////////////
    //   CLEARING DATA FROM MAP
    ///////////////////////////////////////////////////////////
    clearMapFunc: function(){
        // Removing Polygon
        if(this.Polygon!=null){
            this.map.removeLayer(this.Polygon);
        }
        if(this.PotHolesLayer!=null){
            this.PotHolesLayer.clearLayers(); 
        }
        if(this.AbandonLayer!=null){
            this.AbandonLayer.clearLayers(); 
        }
        if(this.StreetLightLayer!=null){
            this.StreetLightLayer.clearLayers(); 
        }
        if(this.DivvyStationLayer!=null){
            this.DivvyStationLayer.clearLayers(); 
        }
        if(this.RecentCrimeLayer!=null){
            this.RecentCrimeLayer.clearLayers(); 
        }
        if(this.RestPOILayer!=null){
            this.RestPOILayer.clearLayers(); 
        }
        if(this.RestaurantLayer!=null){
            this.RestaurantLayer.clearLayers(); 
        }
        if(this.CTATrackerLayer!=null){
            this.CTATrackerLayer.clearLayers(); 
        }
        // Removing Path
        d3.selectAll("path").remove();
		window.started = false;
       // console.log(this.markerArray[0]+ ' ' +this.markerArray.length);

        //~ if((this.markerArray).length >0){
            //~ for (var i = 0 ; i<=this.markerArray.length; i++){
                //~ this.map.removeLayer(this.markerArray[i]);
            //~ } 
        //~ }
        clearAllLayers();
        setTimeout(function() {
        d3.select(".leaflet-marker-pane").html(null);
        d3.select(".leaflet-shadow-pane").html(null);
        }, 500);

    },
    init: function(whereToRender){
    
    ////////////////////////////////////////////////////////////
    //   DEFINING MAP PARAMETERS AND ZOOM LEVEL AND VIEW
    ///////////////////////////////////////////////////////////

        this.map = L.map(whereToRender, {
            center: [41.867490, -87.633645],
            zoom: 15,
            layers: [this.Aerial]
            });
        
        // Calling the BaseLayer and Overlay Feature
        this.layerOverview();

        this.map._initPathRoot();  

    }
});

