// Map variable
var map;
// Markers array/ Markers Model
var markers = [];
// For markers infowindow
var infowindow;

// Knockout ViewModel
var ViewModel = function() {
    var self = this;

    // This will hold the markers data after every request
    self.dineList = ko.observableArray([]);
    self.searchInput = ko.observable("");
    // This will hold the categories data
    self.categories = ko.observableArray(categoriesData);
    self.selectedCategory = ko.observable("a");

    // Filter list based on search input
    self.filterList = function() {
        getFilterList(self.searchInput());
        showMarkers();
    }

    // Open infowindow on click on a li element
    self.openInfoWindow = function(data) {
        // Toggle marker bounce animation
        toggleBounce(data);

        populateInfoWindow(data);
    }
};

var viewModel = new ViewModel();

// Disable knockout from using jQuery for handling UI events
ko.options.useOnlyNativeEvents = true;
// Apply knockout binding to ViewModel
ko.applyBindings(viewModel);



// Create markers for the places returned by Zomato search API request
function createMarker(data) {
    // Remove current markers from map
    removeMarkers();
    // Clear markers array
    markers = [];
    // Info Window
    infowindow = new google.maps.InfoWindow();

    data.forEach(function(data) {
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            // map: map,
            position: {
                lat: parseFloat(data.restaurant.location.latitude, 10),
                lng: parseFloat(data.restaurant.location.longitude, 10)
            },
            title: data.restaurant.name,
            animation: google.maps.Animation.DROP,
            // Marker/List display will be toggled based on this property
            display: ko.observable(true),
            info: {
                url: data.restaurant.url,
                avgCost: data.restaurant.average_cost_for_two,
                cuisines: data.restaurant.cuisines,
                image: data.restaurant.featured_image,
                address: data.restaurant.location.address,
                rating: data.restaurant.user_rating.aggregate_rating,
                ratingText: data.restaurant.user_rating.rating_text,
                ratingColor: data.restaurant.user_rating.rating_color
            }
        });
        // Push the marker to the array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow on each marker.
        marker.addListener('click', function() {
            // Toggle marker bounce animation
            toggleBounce(marker);

            populateInfoWindow(this);
        });
    });
    // Push the marker to the knockout viewModel.dineList array
    viewModel.dineList(markers);
    // Show markers on map
    showMarkers();
}

// Display marker based on their display property
function showMarkers() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].display()) {
            markers[i].setMap(map);
            // Extend bounds only if lat, lng is specified
            if (markers[i].position.lat() != 0 || markers[i].position.lng() != 0) {
                bounds.extend(markers[i].position);
            }
        } else {
            markers[i].setMap(null);
        }
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    
    // If no results found then alert user
    if (markers.length == 0) {
        alert("No results found in 2 kilometer radius");
    }
};

// Remove current markers from map
function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
    }
}

// Filter the list and markers on search input based on their display property
function getFilterList(searchInput) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].title.toUpperCase().indexOf(searchInput.toUpperCase()) == -1) {
            markers[i].display(false);
        } else {
            markers[i].display(true);
        }
    }
};

// This function populates the infowindow when the marker is clicked with the
// info regarding that marker.
function populateInfoWindow(marker) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        var content = '<div class="infowindow">' +
				'<div class="infowindowTitle">' +
                    '<a target="_blank" href=\"' + marker.info.url + '\">' + marker.title + '</a>' +
                '</div>' +
				'<div class="infowindowAddress">' + marker.info.address + '</div>' +
				'<div class="infowindowRatings" style=\"color: ' + '#' + marker.info.ratingColor + '\">' +
					'<span class="ratingText">' + marker.info.ratingText + '</span>' +
					'<span class="ratings">' + marker.info.rating + '</span>' +
				'</div>' +
				'<div class="infowindowImage">' +
					'<img src=\"' + marker.info.image + '\" alt=\"' + marker.title + '\" />' +
				'</div>' +
			'</div>'
        infowindow.setContent(content);
        infowindow.open(map, marker);
        // Set infowindow.marker to null when infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.marker = null;
        });
    }
}

function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1500);
}
