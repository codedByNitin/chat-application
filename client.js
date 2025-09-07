
const socket =io('https://your-railway-app.up.railway.app');

const form = document.getElementById('send-container');
const messageInput=document.getElementById('messageInp')
const messageContainer= document.querySelector(".container")

const append=(message,position)=>{
    const messageElement =document.createElement('div')
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
}

// Ask name and notify server (force non-empty name)
let name;
while (!name) {
    name = prompt("Enter your name to join");
}
socket.emit('new-user-joined', name);


socket.on('user-joined', userName =>{
    append(`${userName} joined the chat`,'right');
});


form.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);   
    messageInput.value = '';
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left'); // dusre user ka msg show kar
})


socket.on('left', userName => {
    append(`${userName} left the chat`, 'right');
});
