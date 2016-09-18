mapLink = 
'<a href="http://openstreetmap.org">OpenStreetMap</a>';

var td = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/terrain.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
subdomains: '1234',
mapID: 'newest',
app_id: 'xP4bpKAjWH0VB9JGLJGY',
app_code: '5LxaBGbamsXQdTeEKw_m3Q',
base: 'aerial',
minZoom: 0,
maxZoom: 20
});
var osm = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data &copy; ' + mapLink,
});
var sat = L.tileLayer(
		'http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
subdomains: '1234'
});
var chicagoBorder = L.tileLayer(
		"http://media.apps.chicagotribune.com/maptiles/chicago-mask/{z}/{x}/{y}.png",
		{ maxZoom: 16, minZoom: 8, opacity: 0.5 });

var map = L.map('map', { //).setView([41.85, -87.65], 13);
center: [41.90, -87.60],
		zoom: 13,
		layers: [td]
});
var baseMaps = {
	"Terrain Day (default)": td,
	"OpenStreetMaps": osm, 
	"Satellite": sat
}
var overlayMaps = {
	"Chicago Border": chicagoBorder, 
}
mapLink = 
'<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.control.scale().addTo(map);
var layercontrol = L.control.layers(baseMaps, overlayMaps, {position: 'bottomleft'}).addTo(map);


