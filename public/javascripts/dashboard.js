(()=>{  
  const statusButtons = document.querySelectorAll(".status span");
  
  function applyStatus(){
    statusButtons.forEach(elem => {
      elem.className="";
    });

    axios.get('/user/dashboard/statusImport')
    .then((res) => {
        for(let item in res.data) {
          let currButton = document.querySelector(`#${item}>[status="${res.data[item]}"]`)
          if(currButton) currButton.className="active";
        }
      })
      .catch((err) => {console.log(err);});
  }

  function updateStatusToTheDB(e){
    const jobId = e.target.parentNode.getAttribute('id');
    const status = e.target.getAttribute('status');
    axios({
      url: `/user/dashboard/statusUpdate/${jobId}/${status}`,
      method: 'POST'
    })
    .then(res => {
      applyStatus();
    })
    .catch(err=>{
      console.log(err);
    });
  }
  
  if(statusButtons.length>0){
    applyStatus();
    statusButtons.forEach(button=>button.addEventListener("click", updateStatusToTheDB));
  }
})();