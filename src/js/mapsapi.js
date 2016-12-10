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

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
          console.log(pos);
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

function handleLocationError(browserHasGeolocation, pos) {
    // infoWindow.setContent(browserHasGeolocation ?
    //     'Error: The Geolocation service failed.' :
    //     'Error: Your browser doesn\'t support geolocation.');
}
