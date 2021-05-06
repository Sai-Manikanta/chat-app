var socket = io();

const form = document.getElementById("form");
const messageInput = document.getElementById("message");
const outputElement = document.getElementById('output');
const typing = document.getElementById('typing');
const typingOutput = document.getElementById('typing-output');
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const messageBox = document.getElementById("message-box");

const messageForm = document.getElementById("messages-form");
const loadPasswordInput = document.getElementById("textpass");

const loadBox = document.getElementById("load-box");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name');

// wish
var myDate = new Date();
var hrs = myDate.getHours();

var greet;

if (hrs < 12)
        greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening';

typing.textContent = greet;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageLength = messageInput.value.length;

    if((messageLength != 0)) {
        const data = {
            name: name,
            message: messageInput.value
        }

        socket.emit('inputChat', data);
    }

    messageInput.value = "";
})

messageInput.addEventListener('keyup', () => {
    socket.emit('typing', name);
})

clearBtn.addEventListener('click', () => {
    socket.emit('clear');
})

// listening to events
let messages = "";

socket.on('chat', (msgs) => {
    if(msgs.length){
        messages = msgs;
    }
})

// messages loading
messageForm.addEventListener('submit', (e) => {
     e.preventDefault();

     // testing for deploy - this comment not about any thing

     if(loadPasswordInput.value == "Sep6"){
            let eles = "";
            for(var i = 0;i < messages.length; i++){
                eles += `<p class=${messages[i].name == 'Friend1' ? 'text-indigo-400' : 'text-pink-400'}>${messages[i].message}</p>`;
            }

            outputElement.innerHTML = eles;
            outputElement.classList.add("display");
            messageBox.classList.add("display");
            loadBox.classList.add("display-none");
    } else {
        window.alert("Wrong password...");
    }
})

socket.on('output', (message) => {
    typing.textContent = greet;
    const name = message[0].name;
    const currentUser = "bg-gray-300 p-1";
    outputElement.innerHTML += `<p class=${name == 'Friend1' ? 'text-indigo-400' : 'text-pink-400'}>${message[0].message}</p>`;

    // scroll to bottom
    outputElement.scrollTop = outputElement.scrollHeight;
})

socket.on('typing', (data) => {
    typing.textContent = `${data} is typing...`;
})

socket.on('cleared', () => {
    outputElement.innerHTML = "";
})