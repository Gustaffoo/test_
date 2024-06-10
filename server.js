npm init -y
npm install express socket.io
touch server.js
code server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serwowanie strony HTML bezpośrednio z serwera
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chat App</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                #chat-container {
                    max-width: 600px;
                    width: 100%;
                    background-color: white;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                #messages {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    height: 300px;
                    overflow-y: scroll;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 10px;
                }

                #messages li {
                    padding: 8px;
                    border-bottom: 1px solid #ddd;
                }

                #form {
                    display: flex;
                }

                #input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                button {
                    padding: 10px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div id="chat-container">
                <ul id="messages"></ul>
                <form id="form" action="">
                    <input id="input" autocomplete="off" placeholder="Type your message here..." /><button>Send</button>
                </form>
            </div>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();

                const form = document.getElementById('form');
                const input = document.getElementById('input');
                const messages = document.getElementById('messages');

                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (input.value) {
                        socket.emit('chat message', input.value);
                        input.value = '';
                    }
                });

                socket.on('chat message', function(msg) {
                    const item = document.createElement('li');
                    item.textContent = msg;
                    messages.appendChild(item);
                    window.scrollTo(0, document.body.scrollHeight);
                });
            </script>
        </body>
        </html>
    `);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

