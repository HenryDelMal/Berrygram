var server = "http://ardilla.cuy.cl:5000";

var webworksreadyFired = false,
  darkColoring = false,
  darkScreenColor = 'black';

document.addEventListener('webworksready', function(e) {
  // This is code to ensure that if webworksready is fired multiple times we still only init() one time
  if (webworksreadyFired) return;
  webworksreadyFired = true;

  var config;
  // Toggle our coloring for testing
  if (darkColoring) {
    config = {controlsDark: true,
        listsDark: true,
        bb10ForPlayBook: true};
  } else {
    config = {controlsDark: false,
        listsDark: false,
        coloredTitleBar: true,
        bb10ForPlayBook: true};
  }

  // Handle styling of the screen before it is displayed
  config.onscreenready = function(element, id, params) {
                if (darkColoring && bb.device.isBB10) {
                  var screen = element.querySelector('[data-bb-type=screen]');
                  if (screen) {
                    screen.style['background-color'] = darkScreenColor;
                  }
                }

                if (id == 'chats') {
                  chatsOnLoad_initialLoad(element);
                } else if (id == 'send_test'){
                  if (typeof params.phone !== "undefined"){
                    element.getElementById('to_user').value = params.phone;
                  }
                } else if (id == 'bubbles') {
                  bubblesOnLoad_initialLoad(element, params.chat_id);
                } else if (id == 'dataOnTheFly') {
                  dataOnTheFly_onScreenReady(element);
                }

                // Remove all titles "except" input and pill buttons screen if running on BB10
                if (bb.device.isBB10 && (id != 'input') && (id != 'pillButtons') && (id != 'titlePillButtons')) {
                  var titles = element.querySelectorAll('[data-bb-type=title]');
                  if (titles.length > 0) {
                    titles[0].parentNode.removeChild(titles[0]);
                  }
                }

                // Initialize our title pill buttons screen
                if (bb.device.isBB10 && (id == 'titlePillButtons')) {
                  titlePillButtons_Init(element);
                }

              };
  // Handle styling of the screen after it is displayed
  config.ondomready = function(element, id, params) {
                if (id == 'dataOnTheFly') {
                  dataOnTheFly_initialLoad(element);
                }
              };

  // You must call init on bbUI before any other code loads.
  // If you want default functionality simply don't pass any parameters.. bb.init();
  bb.init(config);
  if (darkColoring && bb.device.isBB10) {
    document.body.style['background-color'] = darkScreenColor;
    document.body.style['color'] = 'white';
  }

  var authCookie = Cookies.get()["auth_hash"];
  authCookie_type = typeof authCookie;
  var auth_data;
  if (authCookie_type === "undefined"){
    bb.pushScreen("login.html", "login");

  } else {

    $.ajax(server+'/check_auth', {
       data: JSON.stringify({auth_hash: authCookie}),
       type: 'POST',
       contentType: 'application/json',
       dataType: 'json',
       success: function(data) { auth_data=data; },
    });
    console.log("Authenticated= "+ auth_data["authenticated"]);
    if (auth_data["authenticated"]== 'true'){
      bb.pushScreen("chats.html", 'chats');
    } else {
      bb.pushScreen("login.html", "login");
    }
  }


}, false);

// Fire the webworksready event for PlayBook and BBOS
window.addEventListener('load',function() {
    if (navigator.userAgent.indexOf('BB10') < 0) {
      var evt = document.createEvent('Events');
      evt.initEvent('webworksready', true, true);
      document.dispatchEvent(evt);
    }
  });

  $.ajaxSetup({
    async: false
  });

var auth_hash;
var phone_temp;
var phone_code_hash;

function login(){
  var full_number = document.getElementById("area_code").value + document.getElementById("phone").value;
  phone_temp = full_number;
  $.ajax(server+'/login', {
     data: JSON.stringify({phone: full_number}),
     type: 'POST',
     contentType: 'application/json',
     dataType: 'json',
     success: function(data) { auth_hash=data; },
  });
  console.log(auth_hash[0]);
  authCookie = auth_hash[0];
  phone_code_hash = auth_hash[1];
  Cookies.set('auth_hash', authCookie, { expires : 365 });
  bb.pushScreen("auth.html", 'auth');
}



function login_auth(){
  $.ajax(server+'/login', {
     data: JSON.stringify({auth_hash: authCookie, phone_temp: phone_temp, phone_code_hash: phone_code_hash, code: document.getElementById("code").value}),
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

  bb.pushScreen("chats.html", 'chats');
}

function get_chats(){
  var chats;
// $.getJSON(server+"/get_chats", function(json){
//    chats = json;
//  });

  return chats;
}

var last_send_id;

function go_to_chat(id){
  bb.pushScreen("bubbles.html", 'bubbles', {chat_id: id});
}
