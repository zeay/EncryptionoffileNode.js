var xhr;
var token = "token"
var id;
var serverRequest = function(url, method,  data, callback){
    xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer '+token);
    xhr.onload = callback;
    var stringifyData = JSON.stringify(data);
    xhr.send(stringifyData);
};