function bubblesOnLoad_initialLoad(element, chat_id) {
  var listItem, listItem2, dataList = element.getElementById('chatWindow');
  var result, my_id, last_element;
  $.get(server+'/get_my_id', function(data){
    my_id = data;
  });

  $.ajax({
    type: 'POST',
    url: server+'/get_msgs',
    data: JSON.stringify({chat_id: chat_id, limit: 20}),
    success: function(data) { result=data; },
    contentType: "application/json",
    dataType: 'json'
});

  element.getElementById('chat_id').value = chat_id;

  $.each(result, function(index, row){
    listItem = document.createElement('div');
    listItem.setAttribute('data-bb-type', 'bbm-bubble');
    if (row.from == my_id){
      listItem.setAttribute('data-bb-style', 'right');
    } else {
      listItem.setAttribute('data-bb-style', 'left');
    }
    listItem.setAttribute('id', 'msg_'+row.id);
    dataList.appendChild(listItem);
    listItem2 = document.createElement('div');
    listItem2.setAttribute('data-bb-type', 'item');
    listItem2.setAttribute('data-bb-img', '1px.png');
    listItem2.innerHTML = row.message;
    listItem.appendChild(listItem2);
    last_element = 'msg_'+row.id
  });

}

function bubbles_send_txt(){
  $.ajax(server+'/send_txt', {
     data: JSON.stringify({to_user: document.getElementById("chat_id").value,
                          text: document.getElementById("message").value}),
     type: 'POST',
     contentType: 'application/json',
     dataType: 'json'
  });

  bb.pushScreen("bubbles.html", 'bubbles', {chat_id: document.getElementById("chat_id").value});
}
