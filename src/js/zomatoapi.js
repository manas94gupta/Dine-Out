var API_KEY = '8807504cbe0f07822eb741817f606d60';

// $.ajax({
//     // method: GET,
//     url: 'https://developers.zomato.com/api/v2.1/search',
//     dataType: 'json',
//     headers: {
//         'Accept': 'application/json',
//         'user-key': API_KEY
//     },
//     data: {
//         'q': 'Delhi'
//     },
//     error: function (xhr) {
//         console.log(xhr.statusText);
//     },
//     success: function (response) {
//         console.log(response);
//     }
// });

function searchZomato(pos) {
    $.ajax({
        // method: GET,
        url: 'https://developers.zomato.com/api/v2.1/search',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: {
            'lat': pos.lat,
            'lon': pos.lng
        },
        error: function (xhr) {
            console.log(xhr.statusText);
        },
        success: function (response) {
            console.log(response);
            var data = response.restaurants;
            createMarker(data);
        }
    });
}
