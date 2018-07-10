var map = L.map('map-view').setView([37.773972, -122.431297], 6);
var apiKey = '8tAklXuJesVWISwjI8KGISKBmZ9WfHW2';

var Wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 100
});
map.addLayer(Wikimedia);