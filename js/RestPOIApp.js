////////////////////////////////////////////////////////////////////
// by Sharad Tanwar for Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified on 6th November
// Creating Rest POI Variables
////////////////////////////////////////////////////////////////////
var RestPOIApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.restPOIFeatureJson = {};
        this.olderIcon = null;
        this.newerIcon = null;
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];

    },
////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTION TO GET Rest POI VEHICLES
////////////////////////////////////////////////////////////////////

    makeCallback: function (restPOICollection) {

        var restPOIJson ={};

        restPOICollection.forEach(function(d) {

         var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

            if (d.latitude && d.longitude)
                {
                    if (isNaN(d.latitude))
                        console.log("latitude is not a number");
                    if (isNaN(d.longitude))
                        console.log("longitude is not a number");

                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

                    var today = new Date();
                    d.myDate = parseDate(d.inspection_date);

                    var custDate = d.myDate
                    
                    d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373

                    //Getting Custom Message for User based on status of the request
                    // Choosing to show inspections done in last three months.. Good Enough??
                    if(d.daysAgo < 121){
                        // If the establishment passed the inspection.
                        if(d.results.substring(0, 4)== 'Pass'){
                            d.status_message = 'Treat your gastronomic fantasies!';
                            restPOIFeatureJson = {
                                "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [d.longitude,d.latitude]
                                    }
                            }

                                // var stationGeoJson = 
                                L.geoJson(restPOIFeatureJson, { 
                                    pointToLayer: function (feature, latlng) {

                                        var content = '<b><center><u>Food Inspection Card</u></center></b><P><B> Restaurant Name: </B>'
                                                    + d.aka_name+ '<B><br>Inspection Date: </B>' 
                                                    + moment(d.myDate).format("MMM Do YYYY") + '<BR><B> Status: </B>' 
                                                    + d.results + '<B><BR> Risk Level: ' + d.risk
                                                    + '<B><BR> Street: ' 
                                                    + d.address + '<BR><b>'
                                                    + d.status_message +  '</b></P>';
                                        //console.log('ABANDON VeHICLE');
                                        var popup = L.popup().setContent(content);

                                        // Change to this after adding icons
                                        var oldLeafIcon = L.Icon.extend({
                                            options: {
                                                //shadowUrl: '../docs/images/leaf-shadow.png',
                                                iconSize:     [25, 25],
                                                //shadowSize:   [50, 64],
                                                iconAnchor:   [0, 0],
                                                //shadowAnchor: [4, 62],
                                                popupAnchor:  [0,0],
                                                opacity : 0.2
                                            }
                                        });

                                        var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'thumbs-up', markerColor: 'blue', prefix: 'fa', iconColor: 'black'});


                                    //var olderIcon = new oldLeafIcon({iconUrl: './images/abandoned_vehicle.png'});
                                    //var marker = L.marker(latlng,{icon: olderIcon});
                                    var marker  = L.marker(latlng, {icon: redMarker});
                                        marker.bindPopup(popup);
                                    return marker;  
                                    
                                }
                            }).addTo(mapContainer.RestPOILayer);
                        }
                        else{
                            // If the establishment failed or out of business.. Should we explicitly remove out of business places?
                            d.status_message = 'Sit this one out!';
                            restPOIFeatureJson = {
                                    "type": "Feature",
                                        "properties": {},
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [d.longitude,d.latitude]
                                        }
                                }

                                // var stationGeoJson = 
                                L.geoJson(restPOIFeatureJson, { 
                                    pointToLayer: function (feature, latlng) {
                                        
                                        var content = '<b><center><u>Food Inspection Card</u></center></b><P><B> Restaurant Name: </B>'+ d.aka_name+ '<B><br> Inspection Date: </B>' 
                                                    + moment(d.myDate).format("MMM Do YYYY") + '<B><br>Status : </B>' 
                                                    + d.results + '<B><BR> Risk Level: ' + d.risk
                                                    + '<B><BR> Street: ' 
                                                    + d.address + '<BR><b>'
                                                    + d.status_message +  '</b></P>';
                                        var popup = L.popup().setContent(content);

                                        /*var redMarkerOptions = {
                                            radius: 10,
                                            fillColor: "Red",
                                            color: "#000",
                                            weight: 1,
                                            opacity: 1,
                                            fillOpacity: 0.5
                                        };
                                        */
                                        var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'thumbs-down', markerColor: 'red', prefix: 'fa', iconColor: 'black'});

                                    var marker = L.marker(latlng, {icon: redMarker});
                                        marker.bindPopup(popup);
                                    return marker;  
                                        
                                }
                            }).addTo(mapContainer.RestPOILayer);
                        } 
                    }
            }  
            else
            {
                //console.log("FOUND BAD ONE ", +d.latitude, +d.longitude);
                d.LatLng = new L.LatLng(0,0);
            } 
        });

    },

////////////////////////////////////////////////////////////////////
// REST POI CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////   

    restPOILayerFunc: function (marLat1,marLng1,marLat2,marLng2)  {

        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;

        // Clear data from the layer
        mapContainer.RestPOILayer.clearLayers(); 

        var self = this;

        var zipCode = this.marLat1 + ',' + this.marLng1 + ',' + this.marLat2  + ',' +  this.marLng2 + ')';

        var bracket = ")";

        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/4ijn-s7e5.json?$where=within_box(location,".concat(zipCode);
            query = query + '&$order=inspection_date%20DESC';
        //'https://data.cityofchicago.org/resource/zuxi-7xem.json?zip_code='.concat(zipCode);
        //'http://data.cityofchicago.org/resource/7as2-ds3y.json?zip='.concat(zipCode);

        console.log('REST POI ' +  query);

        d3.json(
            query, 
            function(err, response)
                {
                if(err)
                    {
                        console.log("NO DATA at " + this.marLat1 + " " + this.marLng1 + " " + this.marLat2 + " "  + this.marLng2);
                        return;
                    }
                    self.makeCallbackFunc(response);
                });
    },

    ////////////////////////////////////////////////////////
    //  Rest POI FOR POLYLINE ROUTE MODE
    ///////////////////////////////////////////////////////

    restPOIPolylineLayerFunc: function (lat,lng) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;

        // Clear previous data from the layer

        mapContainer.RestPOILayer.clearLayers();

        //var lat = 41.8739580629, 
        //    lon = -87.6277394859;

        var self = this;

        // Taking Location and 500 metre distance around it
        var zipCode = this.marPolyLat + ',' + this.marPolyLng + ',' +'500' + ')';

        var bracket = ")";

        var query = "https://data.cityofchicago.org/resource/4ijn-s7e5.json?$where=within_circle(location,".concat(zipCode);
        //https://soda.demo.socrata.com/resource/earthquakes.json?$where=within_circle(location, 47.616810, -122.328064, 50000)
            query = query + '&$order=inspection_date%20DESC';

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
                    self.makeCallbackFunc(response);
                });

    },

    ////////////////////////////////////////////////////////
    //  INITIALIZE METHOD FOR ABANDONED VEHICLE
    ///////////////////////////////////////////////////////

    init: function () {

        this.makeCallbackFunc = this.makeCallback.bind(this);
       
    }

});
