let map;
let markers = [];

function initMap() {
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(52.52000659999999,13.404954)
  };

  map = new google.maps.Map(
    document.querySelector('#jobs-map'), mapOptions
  );
}

function addMarker(location, text) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: text
  });
  if(!markers.includes(marker)) markers.push(marker);
}

function setMapOnAll(map) {
  if(markers.length !== 0)
    markers[markers.length - 1].setMap(map);
}

function clearMarkers() {
  setMapOnAll(null);
}

function sanitizeLocation(location) {
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

function updateMapPosition(location = "Berlin, Germany", jobTitle = "") {

  const request = {
    query: sanitizeLocation(location),
    fields: ['name', 'geometry'],
  };
  
  const service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);

      clearMarkers();
      addMarker(results[0].geometry.location, jobTitle ? jobTitle : '');
    }
  });
}

function updateStatusToTheDB(e){
  const jobId = e.target.parentNode.getAttribute('id');
  const status = e.target.getAttribute('status');
  axios({
    url: `/user/dashboard/statusUpdate/${jobId}/${status}`,
    method: 'POST'
  })
  .then(res => {
    applyStatusToDashboard();
  })
  .catch(err=>{
    console.log(err);
  });
}

function populateSearchboxLocation(val) {
  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
    query: `
      query allTheCities {
        cities{name}
      }
    `}
  })
  .then(result => {
    const elSearchBox = document.querySelector('select#location');
    const cities = result.data.data.cities.sort((a,b) => a.name.localeCompare(b.name));
    let options = `<option value='' ${!val?'selected="true"':''}">All location</option>`;

    cities.forEach(city=>{
      options+= `<option value="${city.name}" ${val.toLowerCase()===city.name.toLowerCase()?'selected="true"':''}>${city.name}</option>`;
    });
    elSearchBox.innerHTML = options;
  });
}

function addJobToUserList(e){
  e.preventDefault();
  const slug = e.target.getAttribute('slug')
  const companySlug = e.target.getAttribute('companySlug');
  const responseAction = e.target.getAttribute('action'); //addAddBtn
  axios({
    url: `/user/job/add/${slug}/${companySlug}`,
    method: 'POST'
  })
  .then(res => {
    if(res.status === 200){
      // delete element from list view
      switch(responseAction) {
        case "add":
          e.target.removeEventListener("click", addJobToUserList);
          e.target.addEventListener("click", removeJobFromUserList);
          e.target.setAttribute('action','remove');
          e.target.innerText = 'Remove from list';
          break;
        default: 
          e.target.parentNode.parentNode.remove();
      }
    }
  });
}

function removeJobFromUserList(e){
  e.preventDefault();
  const slug = e.target.getAttribute('slug')
  const companySlug = e.target.getAttribute('companySlug');
  const jobId = e.target.getAttribute('jobId');
  const responseAction = e.target.getAttribute('action'); //removeBtn'

  console.log(e, slug, companySlug, jobId);
  axios({
    url: `/user/job/remove/${slug}/${companySlug}/${jobId}`,
    method: 'POST'
  })
  .then(res => {
    if(res.status === 200){
      // delete element from list view
      switch(responseAction) {
        case "add":
          e.target.removeEventListener("click", removeJobFromUserList);
          e.target.addEventListener("click", addJobToUserList);
          e.target.setAttribute('action','add');
          e.target.innerText = 'Add to list';
          break;
        default: 
          e.target.parentNode.parentNode.remove();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  console.log('JS imported successfully!');

  const addListViewButton = document.querySelectorAll(".add-job-to-list.list-view");
  addListViewButton.forEach(button=>button.addEventListener("click", addJobToUserList));

  const addFullViewButton = document.querySelectorAll(".add-job-to-list.full-view");
  addFullViewButton.forEach(button=>button.addEventListener("click", addJobToUserList, 'addRemoveBtn'));

  const addStatusButtons = document.querySelectorAll(".status span");
  addStatusButtons.forEach(button=>button.addEventListener("click", updateStatusToTheDB));

  const addRemoveButtons = document.querySelectorAll(".controls>.addRemoveBtn");
  addRemoveButtons.forEach(button=>{
    if(button.getAttribute('action')==='add') 
      button.addEventListener('click', addJobToUserList);

    if(button.getAttribute('action')==='remove') 
      button.addEventListener('click', removeJobFromUserList);
  });
}, false);