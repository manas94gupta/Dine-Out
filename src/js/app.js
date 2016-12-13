// var location = document.getElementById('location');
// Map variable
var map;
//  Markers array
var markers = [];

// Create markers for the places returned by Zomato search API request
function createMarker(data) {
    data.forEach(function(data) {
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: parseFloat(data.restaurant.location.latitude, 10),
                lng: parseFloat(data.restaurant.location.longitude, 10)
            },
            title: data.restaurant.name,
            animation: google.maps.Animation.DROP
        });
        // Push the marker to the array of markers.
        markers.push(marker);
    });
}
