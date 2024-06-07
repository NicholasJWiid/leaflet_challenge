
// Load the GeoJSON data
let geo_Data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Get the data using d3
d3.json(geo_Data).then(function(data) {
    console.log(data)
    createFeatures(data.features)
});

function createFeatures(earthquake_data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${feature.properties.time}<p>${feature.properties.mag}`);
    }


    let earthquakes = L.geoJson(earthquake_data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor: "red",
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            });
        }
    });


    createMap(earthquakes)
}

function createMap(earthquakes) {
    // Add the tile layer street
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // Add the topographical layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

      let baseMaps = {
        Street: street,
        Topographical: topo
      };

      let overlayMaps = {
        Earthquakes: earthquakes
      };

      // Create the map object
      let myMap = L.map("map", {
        center: [-0.9190759646911368, 131.25944872665374],
        zoom: 5, 
        layers: [topo, earthquakes]
      });

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

}