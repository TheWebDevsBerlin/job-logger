import Map from './map.js';
import SearchBox from './searchbox.js';
// import Dashboard from './dashboard.js';
import Job from './jobs.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = new Map;
  const job = new Job;
  const search_box = new SearchBox;

  console.log('JS imported successfully!');

  if(!window.location.pathname.includes('dashboard')){
    const cards = document.querySelectorAll('.card');
    map.init('#jobs-map');

    cards.forEach((card, idx) => card.addEventListener("mouseenter", ()=>{
      map.updatePosition(jobs[idx].city, jobs[idx].title);
    }))
  }

  const addListViewButton = document.querySelectorAll(".add-job-to-list.list-view");
  addListViewButton.forEach(button=>button.addEventListener("click", job.addToUserList));

  const addFullViewButton = document.querySelectorAll(".add-job-to-list.full-view");
  addFullViewButton.forEach(button=>button.addEventListener("click", job.addToUserList, 'addRemoveBtn'));

  const addRemoveButtons = document.querySelectorAll(".controls>.addRemoveBtn");
  addRemoveButtons.forEach(button=>{
    if(button.getAttribute('action')==='add') 
      button.addEventListener('click', job.addToUserList);

    if(button.getAttribute('action')==='remove') 
      button.addEventListener('click', job.removeFromUserList);
  });

  search_box.populateLocation();

}, false);