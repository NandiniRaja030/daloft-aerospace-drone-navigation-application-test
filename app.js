function initMap(){

    // Map option

    var options = {
        center: {lat: 13.095170 , lng:80.293418 },      
        zoom: 18
    }

    //New Map
    map = new google.maps.Map(document.getElementById("map"),options)

    //listen for click on map location

    google.maps.event.addListener(map, "click", (event) => {
        //add Marker
        addMarker({location:event.latLng});
    })



    //Marker
/*
    const marker = new google.maps.Marker({
    position:{lat: 37.9922, lng: -1.1307},
    map:map,
    icon:"https://img.icons8.com/nolan/2x/marker.png"
    });

    //InfoWindow

    const detailWindow = new google.maps.InfoWindow({
        content: `<h2>Murcia City</h2>`
    });

    marker.addListener("mouseover", () =>{
        detailWindow.open(map, marker);
    })
    */

    //Add Markers to Array

    
    // Add Marker

    function addMarker(property){

        const marker = new google.maps.Marker({
            position:property.location,
            map:map,
            //icon: property.imageIcon
            });

            // Check for custom Icon

            if(property.imageIcon){
                // set image icon
                marker.setIcon(property.imageIcon)
            }

            if(property.content){

            const detailWindow = new google.maps.InfoWindow({
            content: property.content
    });
    
    marker.addListener("mouseover", () =>{
        detailWindow.open(map, marker);
    })
}
}
}


// bhuvan changes 

var map;
var waypoints = [];
var polyline;
var coveredAreaPolygon;

function initMap() {
  var options = {
    center: { lat: 13.09517, lng: 80.293418 },
    zoom: 18,
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  google.maps.event.addListener(map, "click", (event) => {
    addMarker({ location: event.latLng });
  });

  function addMarker(property) {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
    });

    waypoints.push(property.location);

    drawPolyline();
    drawCoveredArea();

    if (property.content) {
      const detailWindow = new google.maps.InfoWindow({
        content: property.content,
      });

      marker.addListener("mouseover", () => {
        detailWindow.open(map, marker);
      });
    }

    // Add a click event to remove the waypoint and update the polyline
    google.maps.event.addListener(marker, "click", () => {
      if (waypoints.length > 1) {
        showDistance(waypoints[waypoints.length - 2], property.location);
      }
      removeWaypoint(marker);
    });
  }

  function drawPolyline() {
    if (waypoints.length > 1) {
      // Remove existing polyline if any
      if (polyline) {
        polyline.setMap(null);
      }

      polyline = new google.maps.Polyline({
        path: waypoints,
        geodesic: true,
        strokeColor: "#FFFF00", // Yellow color
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 1,
              scale: 4,
            },
            offset: "0",
            repeat: "20px",
          },
        ],
      });

      polyline.setMap(map);
    }
  }

  function removeWaypoint(marker) {
    // Find the index of the marker in the waypoints array
    var index = waypoints.indexOf(marker.getPosition());

    if (index !== -1) {
      // Remove the waypoint from the array
      waypoints.splice(index, 1);

      // Remove the marker from the map
      marker.setMap(null);

      // Redraw the polyline and covered area
      drawPolyline();
      drawCoveredArea();
    }
  }

  function showDistance(point1, point2) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1),
      new google.maps.LatLng(point2)
    );

    const distanceInKm = (distance / 1000).toFixed(2);

    const distanceInfoWindow = new google.maps.InfoWindow({
      content: `Distance: ${distanceInKm} km`,
    });

    // Display the InfoWindow above the dotted line
    distanceInfoWindow.setPosition({
      lat: (point1.lat() + point2.lat()) / 2,
      lng: (point1.lng() + point2.lng()) / 2,
    });

    distanceInfoWindow.open(map);
  }

  function drawCoveredArea() {
    // Remove existing covered area polygon if any
    if (coveredAreaPolygon) {
      coveredAreaPolygon.setMap(null);
    }

    if (waypoints.length > 2) {
      // Create a polygon to cover the land area
      coveredAreaPolygon = new google.maps.Polygon({
        paths: waypoints,
        strokeColor: "#00FF00", // Green color
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.35,
      });

      coveredAreaPolygon.setMap(map);
    }
  }
}
