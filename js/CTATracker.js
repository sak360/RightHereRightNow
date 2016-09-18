////////////////////////////////////////////////////////////////////
// by Sharad Tanwar for Project 3 Group 6 : Right Here!! Right Now!!
// Last Modified on 6th November
// Creating CTA Tracker Variables
////////////////////////////////////////////////////////////////////

var CTATrackerApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.ctaTrackerJson = {};

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

    },
    
    

    ////////////////////////////////////////////////////////////
    //   CALLBACK FUNCTION TO ADD TO CTA Tracker LAYER
    ///////////////////////////////////////////////////////////

    makeCallback: function (ctaTrackerCollection) {
        var ctaTrackerFeatureJson ={};
        console.log('CTA Bus Tracker');
        var ctaTracker = ctaTrackerCollection; //.query.results['bustime-response'];
		window.ctmp = ctaTrackerCollection;

			mapContainer.CTATrackerLayer.clearLayers();
            ctaTracker.forEach(function(d) {
                    ctaTrackerFeatureJson = {
                            "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "Point", 
                                    "coordinates": [d.lon,d.lat]
                                }
                        }

                    // Bus Delay
                    var delayHeader = 'Yes';

                    if (!d.dly){
                        delay = 'No';
                    }
                    // Direction 
                    var direction;

                    if(d.hdg<90){
                        direction ="North";
                    }
                    else if(d.hdg < 180){
                        direction = "East";
                    }
                    else if(d.hdg < 270){
                        direction ="South";
                    }
                    else{
                        direction = "West";
                    }

                    L.geoJson(ctaTrackerFeatureJson, { 
                        pointToLayer: function (feature, latlng) {
                        
                            var content = '<B><U><CENTER>CTA Bus Tracker</CENTER></U></B>' 
                                        + '<B>Route : </B>' +  d.rt
                                        + '<B><BR>Route Time : </B>' + d.tmstmp
                                        + '<BR><B>Next Stop : </B>' + d.des
                                        + '<BR><B>Direction : </B>' + direction
                                        + '<BR><B>Delayed : </B><br>'  + delay;
                            var popup = L.popup().setContent(content);

                            var redMarker = 
                             L.AwesomeMarkers.icon({icon: 'bus', markerColor: 'green', prefix: 'fa', iconColor: 'black'});

                                var marker = L.marker(latlng,{icon: redMarker});
                                                marker.bindPopup(popup);
                                            return marker;  
                                
                    }
                }).addTo(mapContainer.CTATrackerLayer);

            });
        //~ }
        

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

////////////////////////////////////////////////////////////////////
// Divvy CALLBACK FOR Polyline CALL 
////////////////////////////////////////////////////////////////////
    ctaPolylineLayerFunc: function (lat,lng) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;
        var self = this;

        // Taking Location and 500 metre distance around it
        if (mapContainer.map.hasLayer(mapContainer.CTATrackerLayer)) {
			var query = 'http://trustdarkness.com/py3/get_busses_in_circle/QiQ2ywWJHstTYzTvk5D9feZrQ/'
	        +this.marPolyLat + '/' + this.marPolyLng + '/' +'0.005';
	
	        d3.json(
	           query, 
	            function(err, response)
	                {
	                if(err)
	                    {
	                    console.log("NO DATA at " + this.marPolyLat + " " + this.marPolyLng );
	                    return;
	                    }
	                    self.makeCallbackFunc(response);
	                });
		}
    },

    ////////////////////////////////////////////////////////
    //  POTHOLE CALLBACK FOR POLYGON BOX VIEW
    ///////////////////////////////////////////////////////

    ctaTrackerLayerFunc: function (marLat1,marLng1,marLat2,marLng2) {

        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;
        //mapContainer.ctaTrackerLayer.clearLayers(); 

        //Getting the temperature
        //console.log('inside potHoleLayerFunc');
        var lat = 41.8739580629, 
            lon = -87.6277394859;

        var self = this;
		if (mapContainer.map.hasLayer(mapContainer.CTATrackerLayer)) {
	        var zipCode = this.marLat1 + '/' + this.marLng1 + '/' + this.marLat2  + '/' +  this.marLng2;
	
	        var bracket = ")";
	
	        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
	        var query = "http://trustdarkness.com/py3/get_busses_in_box/QiQ2ywWJHstTYzTvk5D9feZrQ/".concat(zipCode);   
	            d3.json(
	                query, 
	                function(err, response) {
	                    if(err)
	                        {
	                        $("#ctaerror").toggle();
	                        return;
	                        }
	                        self.makeCallbackFunc(response);
	            });
	        }
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
