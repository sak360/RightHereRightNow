var DivvyStationApp = Class.extend({

    construct: function () {


        this.gwin = {};
        this.divvyFeatureJson = {};
        this.marLat1 = null;
        this.marLng1 = null;
        this.marLat2 = null;
        this.marLng2 = null;
        this.marPolyLat = null;
        this.marPolyLng = null;
        this.marArray = [];


    },
///////////////////////////////////////

    makeCallback: function (divvyCollection,update) {
      //console.log('inside makeCallback divvyApp... update is '+update)
      if (!update) {
	var divvyFeatureJson = {};
	mapContainer.divvySeen = new Map;
	//console.log("creating potholes seen");
      }
      if (window.started) {
	//mapContainer.DivvyStationLayer.clearLayers();
	divvyCollection.forEach(function(d) {
	  statusStr = d.availableDocks+","+d.availableBikes;
	  if (!update) {
	    mapContainer.divvySeen[d.stationName] = statusStr;
	  } else if (mapContainer.divvySeen[d.stationName] != statusStr) {
	    //console.log("divvyseen doesn't match the update "+mapContainer.divvySeen[d.station]+" != "+statusStr);
	    docksbikes = statusStr.split(",");
	    window.updates.push("Divvy station at "+d.stationName+" now has "+docksbikes[0]+" docks and "+docksbikes[1]+" bikes available<br />");
	    mapContainer.divvySeen[d.stationName] = statusStr;
	  }
	  if (d.latitude && d.longitude) {
	    if (isNaN(d.latitude))
	      console.log("latitude is not a number");
	    if (isNaN(d.longitude))
	      console.log("longitude is not a number");
	    d.LatLng = new L.LatLng(+d.latitude, +d.longitude);
	    var divvyFeatureJson ={
	      "type": "Feature",
	      "properties": {},
	      "geometry": {
		"type": "Point",
		"coordinates": [d.longitude,d.latitude]
	      }
	    }
	    L.geoJson(divvyFeatureJson, {                        
	      pointToLayer: function (feature, latlng) {
		var content="<b><center><u>Divvy Card</u></center></b><p><b>Location:</b> "+d.stationName+"<br/>"
		+"<b>Available Bikes:</b> "+d.availableBikes+"<br/>"
		+"<b>Abailable Docks:</b> "+d.availableDocks+"</p>";
		var popup = L.popup().setContent(content);
		var iS = [20, 35]; // size of the icon
		var sS = [10, 16]; // size of the shadow
		var iA = [13, 20]; // point of the icon which will correspond to marker's location
		var sA = [5, 13];  // the same for the shadow
		var pA =  [-1, -20]; // point from which the popup should open relative to the iconAnchor
		var ourIcon = L.icon({
		  iconUrl: 'images/divy-3.png',
		  shadowUrl: 'images/marker-shadow.png',
		  iconSize:     iS, // size of the icon
		  shadowSize:   sS, // size of the shadow
		  iconAnchor:   iA, // point of the icon which will correspond to marker's location
		  shadowAnchor: sA,  // the same for the shadow
		  popupAnchor:  pA // point from which the popup should open relative to the iconAnchor
		});
		var marker = L.marker(latlng, {icon: ourIcon});
		  marker.bindPopup(popup)
		  return marker;
		}										  
	    }).addTo(mapContainer.DivvyStationLayer);
	  }
	})
      }
    },
			

    
////////////////////////////////////////////////////////////////////
// Divvy CALLBACK FOR Polyline CALL 
////////////////////////////////////////////////////////////////////
    divvyPolylineLayerFunc: function (lat,lng,update) {

        this.marPolyLat = lat;
        this.marPolyLng = lng;

        // Clear previous data from the layer

        //mapContainer.divvyLayer.clearLayers();

        var self = this;

        // Taking Location and 500 metre distance around it
        var query = 'http://trustdarkness.com/py3/get_nearby_stations/'
        +this.marPolyLat + '/' + this.marPolyLng + '/' +'0.005';

       // var bracket = ")";

        //var query = "https://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_circle(location,".concat(zipCode);
        //https://soda.demo.socrata.com/resource/earthquakes.json?$where=within_circle(location, 47.616810, -122.328064, 50000)
        //    query = query + '&$order=creation_date%20DESC';

        //console.log(query);
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
////////////////////////////////////////////////////////////////////
// STREET LIGHT CALLBACK FOR BOX CALL 
////////////////////////////////////////////////////////////////////

    divvyLayerFunc: function (marLat1,marLng1,marLat2,marLng2,update) {

        this.marLat1 = marLat1;
        this.marLng1 = marLng1;
        this.marLat2 = marLat2;
        this.marLng2 = marLng2;

        // Clear data from the layer
        //mapContainer.DivvyStationLayer.clearLayers();

        var self = this;

        var zipCode = this.marLat1 + '/' + this.marLng1 + '/' + this.marLat2  + '/' +  this.marLng2;

        var bracket = ")";

        //var query = 'https://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date%20DESC&zip_code='.concat(zipCode);
        var query = "http://trustdarkness.com/py3/get_stations_in_box/".concat(zipCode);

        console.log('Divvy'  + query);
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
		    mapContainer.DivvyStationLayer.clearLayers();
                    self.makeCallbackFunc(response,update);
                });

    },



////////////////////////////////////////

    init: function () {


        this.makeCallbackFunc = this.makeCallback.bind(this);
        //console.log("divvy init works");
        //this.loadInIcons();
        //this.updateOutsideTemp();
    }

});
