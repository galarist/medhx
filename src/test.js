const axios = require('axios').default;

// Make a request for a given URL
axios.get('http://localhost:4000/profile.php')
.then(function (response) {
  // handle success
  console.log('USER READ PASSED');
})
.catch(function (error) {
  // handle error
  console.log(error);
})
.then(function () {
  // always executed
});

const user = JSON.stringify({ contact: 'REERERE', userID: 2 });
axios.post("http://localhost:4000/profile.php", user)
.then(function(response) {
  console.log('USER CREATE & UPDATE PASSED')
}).catch(function(error) {
  console.log(error)
})

const userDelete = JSON.stringify({ removeID: 2 });
axios.post("http://localhost:4000/profile.php?remove", userDelete)
.then(function(response) {
  console.table('USER DELETE PASSED')
}).catch(function(error) {
  console.log(error)
})