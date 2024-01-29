// app.js

const socket = io();

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  socket.emit('chat message', document.getElementById('m').value);
  document.getElementById('m').value = '';
  return false;
});

socket.on('chat message', function(msg) {
  const ul = document.getElementById('messages');
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(msg));
  ul.appendChild(li);
});
