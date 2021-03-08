const express = require('express');
const socket = require('socket.io');
const mongo = require('mongodb').MongoClient;

const app = express();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.use(express.static('public'));

const mongodbURI = "mongodb://mani:Susheela333@cluster0-shard-00-00.9l919.mongodb.net:27017,cluster0-shard-00-01.9l919.mongodb.net:27017,cluster0-shard-00-02.9l919.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-4ons9z-shard-0&authSource=admin&retryWrites=true&w=majority";
mongo.connect(mongodbURI, (err, db) => {
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    const io = socket(server);

    io.on('connection', (socket) => {

        let chat = db.collection('chats');

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            socket.emit('chat', res);
        });

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Handle input events
        socket.on('inputChat', function(data){
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');

            } else {

                // Insert message
                chat.insert({name: name, message: message}, function(){
                    io.sockets.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
        })

        socket.on('clear', () => {
            chat.remove({}, function(){
                // Emit cleared
                io.sockets.emit('cleared');
            });
        })
    })
});