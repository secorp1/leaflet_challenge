

    let basmap = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data: &copy;'
    });

    let map = L.map("map", {
        center: [40.7, -94.5],
        zoom: 3

    })

    basmap.addTo(map);

    function getColor(depth) {
        if(depth > 90) {
            return "#ea2c2c"
        } else if (depth > 70) {
            return "#ea822c"
        } else if (depth > 50) {
            return "#ee9c00"
        } else if (depth > 30) { 
            return "eecc00"
        } else if (depth > 10) {
            return "#d4ee00"
        }
        else {
            return "#98ee00"
        }
    }

    function getRadius(magnitude) {
        if(magnitude === 0) {
            return 1
        }  
        return magnitude * 4 
    }

    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v.01/summary/all_week.geojson").then(function(data) {
        console.log(data);
       function styleInfo(feature) {
        return {
             opacity: 1,
             fillOpacity: 1,
             fillColor: getColor(feature.geometry.coordinates[2]),
             color: "#000000",
             radius: getRadius(feature.properties.mag),
             stroke: true,
             weight: 0.6
        }
       }

       L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                Magnitude: ${feature.properites.mag} <br>                               
                Depth: ${feature.geometry.coordinates[2]} <br>
                Location: ${feature.properites.place}
            `);                                                                           
        }
       }).addTo(map);

       let legend = L.control({
        position: "bottomright"
       });

       legend.onAdd = function(){
        let container = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ['#ea2c2','#ea822c','#ee9c00','eecc00','#d4ee00','#98ee00'];
        for(let index = 0; index < grades.length; index++) {
            container.innerHTML += `<i style="background: ${colors[index]}"<> ${grades[index]}+ <br>`
        }
        return container;
       }

        legend.addTo(map);


    })    




    
    