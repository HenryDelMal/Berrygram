$(document).ready(function(){
  var node = document.createElement("div");
  var textnode = document.createTextNode("test");
  node.appendChild(textnode);
  document.getElementById("container").appendChild(node)
});
