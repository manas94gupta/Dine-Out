// This project uses Zomato Api to retrieve its restaurants database.
// https://developers.zomato.com/api

var API_KEY = '8807504cbe0f07822eb741817f606d60';

function searchZomato(pos) {
    var categoryId;
    if (!viewModel.selectedCategory()) {
        categoryId = "0";
    } else {
        categoryId = viewModel.selectedCategory().id;
    }
    $.ajax({
        method: 'GET',
        url: 'https://developers.zomato.com/api/v2.1/search',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: {
            'lat': pos.lat,
            'lon': pos.lng,
            'radius': 2000,
            'category': categoryId
        },
        error: function (xhr) {
            console.log('Error: ' + xhr.statusText);
            viewModel.errorText("Error: Dine Out data not available, try again later");
        },
        success: function (response) {
            var data = response.restaurants;
            createMarker(data);
        }
    });
}
