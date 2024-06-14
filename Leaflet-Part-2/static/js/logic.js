
// Load the GeoJSON data
// let geo_Data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

let geo_Data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let plate_Data = "tectonic_plates/PB2002_boundaries.json";

// Get the data using d3
d3.json(plate_Data).then(function(plates) {
    console.log(plates)
    
    d3.json(geo_Data).then(function(data) {
        createFeatures(plates.features, data.features)
    });
});

function colorpicker(earthquake_depth) {
    if (earthquake_depth >= 50) return "#ffffb2";
    else if (earthquake_depth >= 10) return "#fed976";
    else if (earthquake_depth >= 8) return "#feb24c";
    else if (earthquake_depth >= 6) return "#fd8d3c";
    else if (earthquake_depth >= 4) return "#f03b20";
    else if (earthquake_depth >= 0) return "#bd0026"
}


function createFeatures(plate_data, earthquake_data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`
        <h3>Location: ${feature.properties.place}</h3><hr>
        <p><b>Time:</b> ${new Date(feature.properties.time)}<p><b>Magnitude:</b> ${feature.properties.mag}
        <p><b>Depth:</b> ${feature.geometry.coordinates[2]} kms`);
    }

    let earthquakes = L.geoJson(earthquake_data, {
        
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillColor: colorpicker(feature.geometry.coordinates[2]),
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            });
        
        },
    });
    
    var plateStyle = {
        "color": "#f03b20",
        "weight": 2,
        "opacity": 0.8
    };

    let tectonicplates = L.geoJson(plate_data, {
        style: plateStyle
       
    });

    createMap(earthquakes, tectonicplates)

}




function createMap(earthquakes, tectonicplates) {
    // Add the tile layer street

    var Terrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    });

    var Watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
        minZoom: 1,
        maxZoom: 16,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg'
    });

    var Satellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg'
    });

      let baseMaps = {
        Terrain: Terrain,
        Watercolor: Watercolor,
        Satellite: Satellite
      };

      let overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicplates
      };

      // Create the map object
      let myMap = L.map("map", {
        center: [38, -120],
        zoom: 4, 
        layers: [Terrain, earthquakes, tectonicplates]
      });

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    // Add the legend
    var legend = L.control({position: "bottomleft"});
    legend.onAdd = function(earthquakes) {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 4, 6, 8, 10, 50]
        var labels = [];
        console.log(earthquakes)
        
        var legendInfo = "<h3>Earthquake depth in kms</h3>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + grades[0] + "</div>" +
        "<div class=\"max\">" + grades[grades.length - 1] + "</div>" +
        "</div>"

        div.innerHTML = legendInfo;

        grades.forEach(function(grade) {
            console.log(colorpicker(grade))
            labels.push("<li style=\"background-color: " + colorpicker(grade) + "\"></li>")
            
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap)

};