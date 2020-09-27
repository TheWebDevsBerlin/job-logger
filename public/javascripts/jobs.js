export default class Job {

  addToUserList(e){
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
            e.target.removeEventListener("click", this.addToUserList);
            e.target.addEventListener("click", this.removeFromUserList);
            e.target.setAttribute('action','remove');
            e.target.innerText = 'Remove from list';
            break;
          default: 
            let elCard = e.target.parentNode.parentNode;
            elCard.classList.add('added');
            setTimeout(()=>{
              elCard.remove();
            },500)
        }
      }
    });
  }

  removeFromUserList(e){
    e.preventDefault();
    const slug = e.target.getAttribute('slug')
    const companySlug = e.target.getAttribute('companySlug');
    const jobId = e.target.getAttribute('jobId');
    const responseAction = e.target.getAttribute('action'); //removeBtn'

    axios({
      url: `/user/job/remove/${slug}/${companySlug}/${jobId}`,
      method: 'POST'
    })
    .then(res => {
      if(res.status === 200){
        // delete element from list view
        switch(responseAction) {
          case "add":
            e.target.removeEventListener("click", this.removeFromUserList);
            e.target.addEventListener("click", this.addToUserList);
            e.target.setAttribute('action','add');
            e.target.innerText = 'Add to list';
            break;
          default: 
          let elCard = e.target.parentNode.parentNode;
          elCard.classList.add('added');
          setTimeout(()=>{
            elCard.remove();
          },500)
        }
      }
    });
  }

}
