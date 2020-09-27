export default class Map {
  map = null;
  markers = [];

  init(elem) {
    var mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(52.52000659999999,13.404954)
    };

    this.map = new google.maps.Map(
      document.querySelector(elem), mapOptions
    );

    console.log('map ready.')
  }

  addMarker(location, text) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: text
    });
    if(!this.markers.includes(marker)) this.markers.push(marker);
  }

  setOnAll(map) {
    if(this.markers.length !== 0)
      this.markers[this.markers.length - 1].setMap(map);
  }

  clearMarkers() {
    this.setOnAll(null);
  }

  sanitizeLocation(location) {
    let sanitizedLocation = location.split(',');
    switch(sanitizedLocation.length) {
      case 0: 
        return;
      case 1: 
        sanitizedLocation = 
          (location.includes('remote') && location.includes('(')) ?
            location.slice(location.indexOf('(') + 1,location.indexOf(')')) : 
            (location.split('or')) ?
              sanitizedLocation[0].split('or')[0] :
              sanitizedLocation[0];
        break;
      default:
        sanitizedLocation = sanitizedLocation[0] + ', ' + sanitizedLocation[1];
    }
    return sanitizedLocation;
  }

  updatePosition(location = "Berlin, Germany", jobTitle = "") {
    const request = {
      query: this.sanitizeLocation(location),
      fields: ['name', 'geometry'],
    };
    
    const service = new google.maps.places.PlacesService(this.map);

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.map.setCenter(results[0].geometry.location);

        this.clearMarkers();
        this.addMarker(results[0].geometry.location, jobTitle ? jobTitle : '');
      }
    });
  }
}