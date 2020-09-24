let domElement = { 
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  phone: document.getElementById("phone"),
  btn: document.getElementById("submit")
}

let userData = {};

function makeSignUp(){ 
  serverRequest("/signup", "post", userData, function () { 
    let res = JSON.parse(this.response);
    if(res.id && res.token){ 
      localStorage.setItem("token", res.token);
      localStorage.setItem("id", res.id);
      location.href = "/admin.html";
    }else{ 
      alert(res.message);
    }
  })
}

domElement.btn.addEventListener('click', (e) => { 
  e.preventDefault();
  let isEmail = validateEmail(domElement.email.value);
  let isPhone = validatePhone(domElement.phone.value);
  let isPassWord = checkPassword(domElement.password.value);
  if(!isEmail || !isPhone || !isPassWord){
    alert("Email, Password or Phone is not valid");
    return false;
  }

  userData.email = domElement.email.value;
  userData.password = domElement.password.value;
  userData.phone = domElement.phone.value;
  console.log(userData);
  makeSignUp();
});


function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return regex.test(phone);
}

function checkPassword(str){
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}

