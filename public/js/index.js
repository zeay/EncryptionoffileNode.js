let products = document.getElementById("putProducts");
let lat;
let long;
let reqInterval;

//putting global user item
let puttingProducts = function(data){
    let elem = `<p><a href="/download?file=${data}" target="_blank">${data}</a></p>`;
    console.log(products);
    products.innerHTML += elem;
}

//geeting user location
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
      lat = "none",
      long = "none";
      reqInterval = setInterval(processReq, 1000);
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  //registering user cords to server
  function showPosition(position) {
    lat=  position.coords.latitude;
    long= position.coords.longitude;
    //console.log(lat, long);
    reqInterval = setInterval(processReq, 1000);
  }
  
  //handeling user errors
  function showError(error) {
    lat = "none";
    long = "none";
    reqInterval = setInterval(processReq, 1000);
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }

//sending data to server
  function processReq(){ 
      if(!onRequest){
        onRequest = true;
        createXmlhttp("GET", `http://localhost:3000/userInfo?lat=${lat}&long=${long}`, function(){ 
            if(xhttp.status === 200 && xhttp.readyState === 4){
              let message = JSON.parse(this.response);
              console.log(message);
            }
        });
      }
      onRequest = false;
      clearInterval(reqInterval);
  }

//intialising geoLocation
  getLocation();