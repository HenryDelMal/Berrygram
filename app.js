var server = "http://192.168.2.40:5000"
bb.init();

$.get(server+'/check_auth', function(data){
  if (data=="authenticated"){
    bb.pushScreen("chats.html", 'chats');
  } else {
    bb.pushScreen("login.html", "login");
  }
});

function login(){
  var full_number = document.getElementById("area_code").value + document.getElementById("phone").value;
  $.ajax(server+'/login', {
     data: JSON.stringify({phone: full_number}),
     type: 'POST',
     contentType: 'application/json',
     dataType: 'json'
  });
  bb.pushScreen("auth.html", 'auth');
}

function login_auth(){
  $.ajax(server+'/login', {
     data: JSON.stringify({code: document.getElementById("code").value}),
     type: 'POST',
     contentType: 'application/json',
     dataType: 'json'
  });
  bb.pushScreen("chats.html", 'chats');
}

function send_txt(){
  $.ajax(server+'/send_txt', {
     data: JSON.stringify({to_user: document.getElementById("to_user").value,
                          text: document.getElementById("message").value}),
     type: 'POST',
     contentType: 'application/json',
     dataType: 'json'
  });

  bb.pushScreen("send_test.html", 'send_test');
}
