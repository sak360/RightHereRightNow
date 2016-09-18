// For Reference:
// idx 0 ~ this.AbandonLayer           = new L.LayerGroup(); // Abandoned Vehicles
// idx 1 this.StreetLightLayer       = new L.LayerGroup(); // Street Lights Out
// idx 2 this.PotHolesLayer          = new L.LayerGroup(); // Pot Holes
        //~ this.DivvyStationLayer      = new L.LayerGroup(); // Divvy Station Layer
        //~ this.RecentCrimeLayer       = new L.LayerGroup(); // Recent Crime Layer
        //~ this.RestPOILayer           = new L.LayerGroup(); // Food Inspection
        //~ this.RestaurantLayer        = new L.LayerGroup(); // Active Restaurants



function clearAllLayers() {
	m = mapContainer;
	window.started = false;
	m.AbandonLayer.clearLayers();
    m.StreetLightLayer.clearLayers();
	m.PotHolesLayer.clearLayers();
	m.DivvyStationLayer.clearLayers();
	m.RecentCrimeLayer.clearLayers();
	m.RestPOILayer.clearLayers();
	m.RestaurantLayer.clearLayers();
	m.CTATrackerLayer.clearLayers();
	clearInterval(busLoop);
	clearInterval(weatherLoop);
	clearInterval(potholeLoop);
	clearInterval(divvyLoop);
	clearInterval(tickerLoop);
	clearInterval(abandonLoop);
	clearInterval(crimeLoop);
	clearInterval(streetlightLoop);
	clearInterval(divvyLoop);
	d3.selectAll(".leaflet-marker-pane").html(null);
}

function toggleLayer(layerName) {
	if (!window.started) {
		$('#top-message').toggle('drop', {direction: 'up'});
		setTimeout(function () {
			$('#top-message').toggle('drop', {direction: 'down'});	
		}, 7000);
		return;
	}
	
	// for convenience
	m = mapContainer;
	
	if (layerName == "PotHolesLayer") {
		if (m.map.hasLayer(m.PotHolesLayer)) {			
			m.map.removeLayer(m.PotHolesLayer);
		} else {			
			m.map.addLayer(m.PotHolesLayer);			
		}
		jQuery('#potholesicon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "AbandonLayer") {
		if (m.map.hasLayer(m.AbandonLayer)) {
			m.map.removeLayer(m.AbandonLayer)
		} else {
			m.map.addLayer(m.AbandonLayer);
		}
		console.log("Jquery state: " + jQuery.isReady);
		jQuery('#abandonedicon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "StreetLightLayer") {
		if (m.map.hasLayer(m.StreetLightLayer)) {
			m.map.removeLayer(m.StreetLightLayer)
		} else {
			m.map.addLayer(m.StreetLightLayer);
		}
		jQuery('#streetlighticon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "DivvyStationLayer") {
		if (m.map.hasLayer(m.DivvyStationLayer)) {
			m.map.removeLayer(m.DivvyStationLayer)
		} else {
			m.map.addLayer(m.DivvyStationLayer);
		}
		jQuery('#divvyicon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "RecentCrimeLayer") {
		if (m.map.hasLayer(m.RecentCrimeLayer)) {
			m.map.removeLayer(m.RecentCrimeLayer)
		} else {
			m.map.addLayer(m.RecentCrimeLayer);
		}
		jQuery('#crimeicon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "RestPOILayer") {
		if (m.map.hasLayer(m.RestPOILayer)) {
			m.map.removeLayer(m.RestPOILayer)
		} else {
			m.map.addLayer(m.RestPOILayer);
		}
		jQuery('#poiicon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "RestaurantLayer") {
		if (m.map.hasLayer(m.RestaurantLayer)) {
			m.map.removeLayer(m.RestaurantLayer)
		} else {
			m.map.addLayer(m.RestaurantLayer);
		}
		jQuery('#restauranticon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "CTATrackerLayer") {
		if (m.map.hasLayer(m.CTATrackerLayer)) {
			m.map.removeLayer(m.CTATrackerLayer)
		} else {
			m.map.addLayer(m.CTATrackerLayer);
		}
		jQuery('#busicon').toggleClass("selected", 1000, "easeOutSine" );
	} else if (layerName == "WeatherLayer") {
		jQuery('#weather').toggle('fold');
		jQuery('#weathericon').toggleClass("selected", 1000, "easeOutSine" );
	}
}

function selectMap(layerName) {
	if (layerName == 'Aerial') {
		mapContainer.map.removeLayer(mapContainer.ColorView);
		mapContainer.map.removeLayer(mapContainer.MapView);
		mapContainer.map.addLayer(mapContainer.Aerial);
		d3.select("#Aerial").attr("class", "selected");
		d3.select("#ColorView").attr("class", "");
		d3.select("#MapView").attr("class", "");
	} else if (layerName == 'ColorView') {
		mapContainer.map.removeLayer(mapContainer.Aerial);
		mapContainer.map.removeLayer(mapContainer.MapView);
		mapContainer.map.addLayer(mapContainer.ColorView);
		d3.select("#ColorView").attr("class", "selected");
		d3.select("#Aerial").attr("class", "");
		d3.select("#MapView").attr("class", "");
	} else if (layerName == 'MapView') {
		mapContainer.map.removeLayer(mapContainer.ColorView);
		mapContainer.map.removeLayer(mapContainer.Aerial);
		mapContainer.map.addLayer(mapContainer.MapView);
		d3.select("#MapView").attr("class", "selected");
		d3.select("#ColorView").attr("class", "");
		d3.select("#Aerial").attr("class", "");
	}
}


