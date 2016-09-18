////////////////////////////////////////////////////////////////////
// Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified by Sharad on 7th November
// Creating Rest POI Variables
////////////////////////////////////////////////////////////////////
var RestaurantApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.restaurantFeatureJson = {};
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
// CALLBACK FUNCTION TO GET Restaurant Layer
////////////////////////////////////////////////////////////////////

    makeCallback: function (restaurantCollection) {

        var restaurantJson ={};

        restaurantCollection.forEach(function(d) {

         var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

            if (d.latitude && d.longitude)
                {
                    if (isNaN(d.latitude))
                        console.log("latitude is not a number");
                    if (isNaN(d.longitude))
                        console.log("longitude is not a number");

                    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);

                    var today = new Date();

                    //d.myDate = parseDate(d.license_start_date);
                    
                    //d.daysAgo = (today - d.myDate) / 1000 / 60 / 60 / 24; //7-373

                    //Filter based on license description
                    if(d.license_description =='Music and Dance' 
                        || d.license_description =='Mobile Food License'
                        || d.license_description =='Navy Pier Kiosk License'
                        || d.license_description == 'Outdoor Patio'
                        || d.license_description == 'Package Goods'
                        || d.license_description == 'Public Garage'
                        || d.license_description == 'Tavern'
                        || d.license_description == 'Special Event Food'
                        || d.license_description == 'Retail Food Establishment'
                        || d.license_description == 'Public Place of Amusement'
                        || d.license_description == 'Wholesale Food Establishment')

                    {

                        // Setting Icons
                        if(d.license_description =='Music and Dance') {
                            var redMarker = 
                            L.AwesomeMarkers.icon({icon: 'music', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                            d.status_message = 'Music is Life!!!';
                        }
                        else if(d.license_description =='Mobile Food License'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'cutlery', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Food Carts are awesome!';
                        }
                        else if (d.license_description =='Navy Pier Kiosk License'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'star', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Welcome to Navy Pier!';
                        }
                        else if (d.license_description == 'Outdoor Patio'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'star', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Treat your gastronomic fantasies!';
                        }
                        else if (d.license_description == 'Package Goods'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'archive', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Buy goods and more!';
                        }
                        else if (d.license_description == 'Public Garage'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'automobile', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Park like a boss!';
                        }
                        else if (d.license_description == 'Tavern') {
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'beer', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Burp!!!';
                        }
                        else if (d.license_description == 'Special Event Food'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'cutlery', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Treat your gastronomic fantasies!';
                        }
                        else if (d.license_description == 'Retail Food Establishment'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'cutlery', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'OM NOM NOM!!';
                        }
                        else if (d.license_description == 'Public Place of Amusement') {
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'star', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Fun and Food with your family!';
                        }
                        else if (d.license_description == 'Wholesale Food Establishment'){
                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'cutlery', markerColor: 'orange', prefix: 'fa', iconColor: 'black'});
                             d.status_message = 'Treat your gastronomic fantasies!';
                        }

                            
                            restaurantFeatureJson = {
                                "type": "Feature",
                                    "properties": {},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [d.longitude,d.latitude]
                                    }
                            }

                            // var stationGeoJson = 
                            L.geoJson(restaurantFeatureJson, { 
                                pointToLayer: function (feature, latlng) {
                                    
                                    var content = '<b><center><u>POI Card</u></center></b>'
                                                + '<P><B>Name : </B>'+ d.doing_business_as_name 
                                                + '<br><B> Type: </B>' 
                                                + d.license_description + '<B><BR> Street:</b> ' 
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

                                    

                                    //var olderIcon = new oldLeafIcon({iconUrl: './images/abandoned_vehicle.png'});
                                    //var marker = L.marker(latlng,{icon: olderIcon});
                                    var marker  = L.marker(latlng,  {icon: redMarker});
                                        marker.bindPopup(popup);
                                    return marker;  
                                
                                }
                            }).addTo(mapContainer.RestaurantLayer);
                          
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
// RESTAURANT CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////   

    restaurantLayerFunc: function (marLat1,marLng1,marLat2,marLng2)  {

        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;

        // Clear data from the layer
        mapContainer.RestaurantLayer.clearLayers(); 

        var self = this;

        var zipCode = this.marLat1 + ',' + this.marLng1 + ',' + this.marLat2  + ',' +  this.marLng2 + ')';

        var bracket = ")";

        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        var query = "https://data.cityofchicago.org/resource/uupf-x98q.json?$where=within_box(location,".concat(zipCode);
            query = query + '&$order=license_start_date%20DESC';

        //'https://data.cityofchicago.org/resource/zuxi-7xem.json?zip_code='.concat(zipCode);
        //'http://data.cityofchicago.org/resource/7as2-ds3y.json?zip='.concat(zipCode);

        console.log('RESTAURANT LAYER ' +  query);

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

    restaurantPolylineLayerFunc: function (lat,lng) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;

        console.log('this.marPolyLat'  + this.marPolyLat  + 'this.marPolyLng'  + this.marPolyLng);
        // Clear previous data from the layer

        mapContainer.RestaurantLayer.clearLayers();

        //var lat = 41.8739580629, 
        //    lon = -87.6277394859;

        var self = this;

        // Taking Location and 500 metre distance around it
        var zipCode = this.marPolyLat + ',' + this.marPolyLng + ',' +'500' + ')';

        var bracket = ")";

        var query = "https://data.cityofchicago.org/resource/uupf-x98q.json?$where=within_circle(location,".concat(zipCode);
        //https://soda.demo.socrata.com/resource/earthquakes.json?$where=within_circle(location, 47.616810, -122.328064, 50000)
            query = query + '&$order=license_start_date%20DESC';

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
                    console.log("NO DATA at " + this.marPolyLat  + " " + this.marPolyLng);
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
