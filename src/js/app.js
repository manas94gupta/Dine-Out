// Map variable
var map;
// Markers array/ Markers Model
var markers = [];
// For markers infowindow
var infowindow;

// Knockout ViewModel
var ViewModel = function() {
    var self = this;

    // This will be used to open and close sidebar
    self.toggleSidebar = ko.observable(false);
    // This will hold error text if any
    self.errorText = ko.observable("");
    // This will hold the markers data after every request
    self.dineList = ko.observableArray([]);
    // This will hold the search input
    self.searchInput = ko.observable("");
    // This will hold the categories data
    self.categories = ko.observableArray(categoriesData);
    // This will hold the selected category
    self.selectedCategory = ko.observable("");

    // Open sidebar on clicking menu button
    self.openSidebar = function() {
        self.toggleSidebar(true);
    }

    // Close sidebar on clicking close button or outside
    self.closeSidebar = function() {
        self.toggleSidebar(false);
    }

    // Filter list based on search input
    self.filterList = function() {
        getFilterList(self.searchInput());
        showMarkers();
    }

    // Open infowindow on click on a li element
    self.openInfoWindow = function(data) {
        // Toggle marker bounce animation
        toggleBounce(data);
        // Close sidebar
        self.closeSidebar();

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
    // Marker path
    var markerPath = 'M403.8,178.4c0.1,0.2,0.1,0.5,0.2,0.7 M407.3,194.5c4.9,29.6,0.2,59.4-13,89.1   c-19.4,43.8-47.5,81.7-81.3,115.3c-15.5,15.4-32.3,29.5-48.6,44c-1.8,1.6-4.2,2.6-6.3,3.9c-1.5,0-3,0-4.5,0   c-6.1-4.6-12.5-8.9-18.3-13.8c-25.1-21.4-48.5-44.4-69-70.1 M144.6,332.9c-14.6-21.9-27.2-45-34.9-70.4   c-11.3-37.2-8.8-73.8,7.9-109.1c16.6-35.1,43-60.3,78.5-75.9c14.8-6.5,30.4-10.5,46.7-11.7c1-0.1,1.9-0.4,2.8-0.6   c6.7,0,13.4,0,20.1,0c7.8,1.2,15.8,1.9,23.5,3.8c47.3,11.4,82.5,38.7,104.1,82.4c1.9,3.9,3.6,7.7,5.2,11.6 M210.4,159.6   c-17.8,13.6-29.4,35.2-29.9,59.6c-0.9,41.1,33,75.5,75,76.2c40.9,0.6,75.1-32.9,75.9-74.5c0.8-41.6-32.9-76-75-76.6   c-9-0.1-17.6,1.4-25.6,4.2'
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
            icon: {
                path: markerPath,
                strokeColor: '#' + data.restaurant.user_rating.rating_color,
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#18243b',
                fillOpacity: 1,
                scale: 0.1,
                anchor: new google.maps.Point(250, 450)
            },
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
