let upStatus = document.getElementById("uploadStatus");
//ipifo
let ipClick = document.getElementById("ips");
var xhttp;
let putHtml = document.getElementById("mainNavigation");
let dataArea;
let filterBox;
let userinfo1;
if (window.XMLHttpRequest) {
    // code for modern browsers
    xhttp = new XMLHttpRequest();
 } else {
    // code for old IE browsers
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
};

var createXmlhttp = function(method, pName, callback) {
    xhttp.onreadystatechange = callback;
    xhttp.open(method, pName, true);
    xhttp.send();
  };
// define URL and for element
const url = "/adminUpload";
const form = document.querySelector('form');

// add event listener
form.addEventListener('submit', e => {

    // disable default action
    e.preventDefault();

    // collect files
    const files = document.querySelector('[name=file]').files;
    console.log(files);
    const formData = new FormData();
    formData.append('file', files[0]);

    // post form data
    const xhr = new XMLHttpRequest();

    // log response
    xhr.onload = () => {
        console.log(xhr.responseText);
        upStatus.innerHTML = xhr.responseText;
    };
    if(files[0]){
         // create and send the reqeust
        upStatus.innerHTML = "Uploading";
        xhr.open('POST', url);
        xhr.setRequestHeader('key', '12345678');
        xhr.setRequestHeader('salt', '12345678');
        xhr.setRequestHeader('algo', 'des');
        xhr.send(formData);
    }else{
        upStatus.innerHTML = "Provide file";
    }
});

//creating html
function createHTML(data){
    let elem = `<tr><td>${data.ip}</td><td>${data.lat}</td><td>${data.long}</td></tr>`;
    dataArea.innerHTML += elem;
}

//getting userinfo
ipClick.addEventListener('click', (e)=>{
    e.preventDefault();
    createXmlhttp("GET", "ipInfo.html", function(){ 
        if(xhttp.status === 200 && xhttp.readyState === 4){
            putHtml.innerHTML = this.response;
            createXmlhttp("GET", "http://localhost:3000/getInfo", function(){
                dataArea = document.getElementById("dataArea");
                filterBox = document.getElementById("filterBox");
                filterBox.addEventListener("keyup", (e)=>{
                    e.preventDefault();
                    let userdata = userinfo1.filter(uservalue => uservalue.ip.includes(filterBox.value));
                    dataArea.innerHTML= "";
                    userdata.forEach((item, index, userdata)=>{
                        createHTML(item);
                    })
                });
                if(xhttp.status === 200 && xhttp.readyState === 4){ 
                    let userinfo = JSON.parse(this.response);
                    userinfo1 = JSON.parse(userinfo);
                    dataArea.innerHTML = "";
                    userinfo1.forEach((item, index, userinfo)=>{
                        createHTML(item);
                    })
                }
            })
        }
    })
});

