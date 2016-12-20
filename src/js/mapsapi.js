function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 20.593684,
        lng: 78.96288
    },
    zoom: 6
    });

    // If this is not set then dark mode button takes two clicks initially
    // to change style
    map.setOptions({ styles: '' });

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);

    // This is autocomplete for use in the location search.
    var locationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('location'));
    locationAutocomplete.bindTo('bounds', map);

    // This will initiate location search
    document.getElementById('locationBtn').addEventListener('click', function() {
      setLocation();
    });

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
//initMap close
}

// Add a button on map to toggle map styles
function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#252539';
    // controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '10px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '10px';
    controlUI.style.marginLeft = '5px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Toggle Map Mode';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = '#bec0c4';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '10px';
    controlText.style.paddingRight = '10px';
    controlText.innerHTML = 'Dark Mode';
    controlUI.appendChild(controlText);

    // Clicking on the toggle mode button will change the map style
    controlUI.addEventListener('click', function() {
        if (map.styles == '') {
            map.setOptions({ styles: mapDarkStyle });
            controlText.innerHTML = 'Normal Mode';
            controlUI.style.backgroundColor = '#d2d4d8';
            controlText.style.color = '#434343';
        } else {
            map.setOptions({ styles: '' });
            controlText.innerHTML = 'Dark Mode';
            controlUI.style.backgroundColor = '#252539';
            controlText.style.color = '#bec0c4';
        }
    });
}

// This will handle any error in detection geoloaction
function handleLocationError(browserHasGeolocation, pos) {
    if (browserHasGeolocation) {
        // Geolocation service failed
        console.log('Error: Denied geolocation, try selecting location from the menu');
    } else {
        console.log('Error: This browser doesn\'t support geolocation.');
        viewModel.errorText("Error: This browser doesn\'t support geolocation.");
    }
}

// This function takes the input value in the location text input
// locates it, and then sets the center of map to that area, so
// that the user can search in a specific area.
function setLocation() {
    // Close sidebar
    viewModel.closeSidebar();
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var location = document.getElementById('location').value;
    // Make sure the address isn't blank.
    if (location == '') {
        window.alert('You must enter an area, or address.');
    } else {
        // Geocode the address/area entered to get the center. Then, center the
        // map on it and zoom in
        geocoder.geocode(
            { address: location
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(16);
                    searchZomato(results[0].geometry.location);
                } else {
                    window.alert('We could not find that location - try entering a more specific place.');
                }
        });
    }
}
