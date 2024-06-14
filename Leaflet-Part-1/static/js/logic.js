
// Load the GeoJSON data
// let geo_Data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

let geo_Data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data using d3
d3.json(geo_Data).then(function(data) {
    console.log(data)
    createFeatures(data.features)
});

function colorpicker(earthquake_depth) {
    if (earthquake_depth >= 50) return "#810f7c";
    else if (earthquake_depth >= 10) return "#8856a7";
    else if (earthquake_depth >= 8) return "#8c96c6";
    else if (earthquake_depth >= 6) return "#9ebcda";
    else if (earthquake_depth >= 4) return "#bfd3e6";
    else if (earthquake_depth >= 0) return "#edf8fb"
}

function createFeatures(earthquake_data) {

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
        center: [38, -120],
        zoom: 4, 
        layers: [topo, earthquakes]
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