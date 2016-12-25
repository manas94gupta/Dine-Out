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

    // Create the div to hold the dark mode and normal mode button
    // which will toggle the map styles
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);

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
        if (map.styles === '') {
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

function infowindowStyle() {
    // Maps infowindow style
    // The google.maps.event.addListener() event waits for
    // the creation of the infowindow HTML structure 'domready'
    // and before the opening of the infowindow defined styles
    // are applied.
    google.maps.event.addListener(infowindow, 'domready', function() {
        // The div which wraps the contents of the infowindow
        var iwWrap = $('.gm-style-iw');

        // The div to be changed is above the .gm-style-iw div
        // Using .prev() function that div is selected
        var iwBackground = iwWrap.prev();

        // Remove the background shadow div
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // Remove the white background div
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        // Style tail arrow
        iwBackground.children(':nth-child(3)').find('div').children().css({'z-index': '1',
                                                                           'background-color': '#3ec9c3',
                                                                           'outline': '2px solid #341f48',
                                                                           '-webkit-box-shadow': '0 0 4px 1px rgba(0, 0, 0, 0.3)',
                                                                           '-moz-box-shadow': '0 0 4px 1px rgba(0, 0, 0, 0.3)',
                                                                           'box-shadow': '0 0 4px 1px rgba(0, 0, 0, 0.3)'});

        // Style close button
        // Close button is the next div to the .gm-style-iw div
        // Using .next() function that div is selected
        var iwCloseBtn = iwWrap.next();

        // Style close button
        iwCloseBtn.css({'opacity': '1',
                        'right': '50px',
                        'top': '11px',
                        'border-radius': '13px',
                        '-webkit-box-shadow': '0px 0px 0px 5px #2a9a95',
                        '-moz-box-shadow': '0px 0px 0px 5px #2a9a95',
                        'box-shadow': '0px 0px 0px 5px #2a9a95'});

        // It seems that on android and ios clicking on close button doesn't close
        // the infowindow, instead there's a new img element after the close button
        // div which closes the infowindow
        // This img div needs to be positioned correctly
        var iwCloseBtnMobile = iwCloseBtn.next();
        iwCloseBtnMobile.css({'right': '38px'});

        // Overrides the deafult opacity change to 0.7 on mouseout
        iwCloseBtn.mouseout(function(){
            $(this).css({opacity: '1'});
        });
    });
}
