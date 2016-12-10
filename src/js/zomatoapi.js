$.ajax({
    // method: GET,
    url: 'https://developers.zomato.com/api/v2.1/cities',
    dataType: 'json',
    headers: {
        'Accept': 'application/json',
        'user-key': '8807504cbe0f07822eb741817f606d60'
    },
    data: {
        'q': 'Delhi'
    },
    error: function (xhr) {
        console.log(xhr.statusText);
    },
    success: function (response) {
        console.log(response);
    }
});
