var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.570446, lng: 77.325854},
    zoom: 14
  });

  // var atta = {lat: 28.572728, lng: 77.325981};
  // var marker = new google.maps.Marker({
  //   position: atta,
  //   map: map,
  //   title: 'Atta!'
  // });
}
