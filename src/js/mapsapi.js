var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 20.593684,
        lng: 78.96288
    },
    zoom: 6
  });

  // var atta = {lat: 28.572728, lng: 77.325981};
  // var marker = new google.maps.Marker({
  //   position: atta,
  //   map: map,
  //   title: 'Atta!'
  // });

  // This is autocomplete for use in the location search.
  var locationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('location'));
  locationAutocomplete.bindTo('bounds', map);

  // This will initiate location search
  document.getElementById('locationBtn').addEventListener('click', function() {
      setLocation();
  });

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
          map.setCenter(pos);
          map.setZoom(16);
      }, function() {
          handleLocationError(true, map.getCenter());
      });
  } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
  }

}
//initMap close

// This will handle any error in detection geoloaction
function handleLocationError(browserHasGeolocation, pos) {
    // infoWindow.setContent(browserHasGeolocation ?
    //     'Error: The Geolocation service failed.' :
    //     'Error: Your browser doesn\'t support geolocation.');
}

// This function takes the input value in the location text input
// locates it, and then sets the center of map to that area, so
// that the user can search in a specific area.
function setLocation() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var location = document.getElementById('location').value;
    // Make sure the address isn't blank.
    if (location == '') {
        window.alert('You must enter an area, or address.');
    } else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode(
            { address: location
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(16);
                } else {
                    window.alert('We could not find that location - try entering a more specific place.');
                }
        });
    }
}
