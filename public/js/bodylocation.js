if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.longitude)
        console.log(position.coords.latitude) 
        a=position.coords.longitude
        b=position.coords.latitude
        var gloc=a+','+b
        const geo=document.querySelector('#geo')
        geo.textContent=gloc
        mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyam90c2NzIiwiYSI6ImNrNHZpYjUzazBqYmgzbnNjMzlwOW1ibnYifQ.T4Nh2LhQ9733LUy7JMh1Vw';
    var map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [a, b],
        zoom: 16,
        pitch: 180,
        bearing: -17.6,
        container: 'map',
        antialias: true
    });

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load', function() {
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        map.addControl(new mapboxgl.ScaleControl());

        map.addLayer(
            {
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#fd0004',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            },
            labelLayerId
        );
    });
    
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
        })
    );
    
    
    });
} else {
    alert("You Need to manually Enter Your Address");
}