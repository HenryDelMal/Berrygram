function dataOnLoad_initialLoad(element) {
  var listItem, dataList = element.getElementById('dataList');
  var result;
  $.getJSON(server+'/get_chats', function(data) {
    result=data;
  });

  $.each(result, function(index, row){
    listItem = document.createElement('div');
    listItem.setAttribute('data-bb-type', 'item');
    listItem.setAttribute('data-bb-title', row.name);
    listItem.innerHTML = row.message;
    dataList.appendChild(listItem);
  })

}
