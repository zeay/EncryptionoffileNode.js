var xhttp;
var productData;
var onRequest = false;
if (window.XMLHttpRequest) {
    // code for modern browsers
    xhttp = new XMLHttpRequest();
 } else {
    // code for old IE browsers
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
};

//creating xmlhttp request
var createXmlhttp = function(method, pName, callback) {
    xhttp.onreadystatechange = callback;
    xhttp.open(method, pName, true);
    xhttp.send();
  };

//takingcare executing with a boolean variable
if(!onRequest){
    onRequest = true;
    createXmlhttp("GET", "http://localhost:3000/getItems", function(){ 
        if(xhttp.status === 200 && xhttp.readyState === 4){
          productData = JSON.parse(this.response);
          console.log(productData.files);
          productData.files.forEach((item, index, productData)=>{ 
              puttingProducts(item);
          });
        }
        onRequest = false;
    });
}