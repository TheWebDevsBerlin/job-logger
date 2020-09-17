const myJobs = document.querySelector("#job-list");
applyStatusToDashboard();

function applyStatusToDashboard(){
  axios.get('/user/dashboard/statusImport')
    .then((res) => {
      document.querySelectorAll(`.status>span`).forEach(elem=>elem.className="");
      for(let item in res.data) {
        document.querySelector(`#${item}>[status="${res.data[item]}"]`).className="active";
      }
    })
    .catch((err) => {console.log(err);});
}
