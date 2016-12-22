function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 20.593684,
        lng: 78.96288
    },
    zoom: 6
    });

    // This is autocomplete for use in the location search.
    var locationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('location'));
    locationAutocomplete.bindTo('bounds', map);

    // Autocomplete fires a place_changed event when autocomplete suggestion is
    // is selected. Since knockout doesn't detect this change in the input field,
    // getPlace function of place autocomplete is used to change the
    // locationSearchInput in the viewModel.
    locationAutocomplete.addListener('place_changed', function(){
        viewModel.locationSearchInput(locationAutocomplete.getPlace().formatted_address);
    });

    // // This will initiate location search
    // document.getElementById('locationBtn').addEventListener('click', function() {
    //   setLocation();
    // });

    // Get geolocation of the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
          map.setCenter(pos);
          map.setZoom(16);
          searchZomato(pos);
      }, function() {
          handleLocationError(true, map.getCenter());
      });
    } else {
      // If browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }

}
//initMap close

// This will handle any error in detection geoloaction
function handleLocationError(browserHasGeolocation, pos) {
    // infoWindow.setContent(browserHasGeolocation ?
    //     'Error: The Geolocation service failed.' :
    //     'Error: Your browser doesn\'t support geolocation.');
    console.log('error');
}
