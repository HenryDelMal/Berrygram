function chatsOnLoad_initialLoad(element) {
  var listItem, dataList = element.getElementById('dataList');
  var result;
  //$.getJSON(server+'/get_chats', function(data) {
  //  result=data;
  //});
  $.ajax(server+'/get_chats', {
     data: JSON.stringify({auth_hash: Cookies.get()["auth_hash"]}),
     type: 'POST',
     contentType: 'application/json',
     dataType: 'json',
     success: function(data) { result=data; },
  });

  $.each(result, function(index, row){
    listItem = document.createElement('div');
    listItem.setAttribute('data-bb-type', 'item');
    listItem.setAttribute('data-bb-title', row.name);
    listItem.setAttribute('onclick', 'go_to_chat('+row.id+');');
    listItem.innerHTML = row.message;
    dataList.appendChild(listItem);
  })

}
