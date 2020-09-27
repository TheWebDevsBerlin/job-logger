export default class SearchBox {

  populateLocation(val='') {
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
}