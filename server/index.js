const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom} = require('./users');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

//Initialise the server so that we can properly setup socket.io
const server = http.createServer(app);

//Create an instance of socket io
const io = socketio(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});
//Integrate the socket io instance
/**io.on('connection',(socket)=>{}) => This will run when we have a client connection on our io instance.
 * socket.on('disconnect',()=>{}) => This will run when a client connection leaves from teh chat 
 */
io.on('connection',(socket)=>{//The socket will be connected to the connection as a client-side socket. It is 
    //a specific instance of a client side socket
    //console.log('User has joined!!!! :)');
    socket.on('join',({name,room}, callback)=>{//This is the 'join' string emitted by the client-side socket
       // console.log(name, room);
       //Trial
       /* const error = true;
        if(error){
            callback({error:'error'});
        }*/
        const {error, user} = addUser({id:socket.id, name, room});//addUser can only return 2 things - object with error property or
        //object with user property
        if(error)
            return callback(error);
       
        //When a user joins the room, we can handle the messaging events and the messages.
        //1. Focus on the admin generated messages - System messages when someone joins or leaves etc.
        //The following sends a message to the user to welcome them to the room
        socket.emit('message',{user:'admin',text:`Hello ${user.name}! Welcome to the ${user.room} room1`});
        //The following will inform the other users in a room that a new user has joined the room
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined the room!.`});

        socket.join(user.room);

        //To show the list of users in the room 
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)});

        callback();
    });
    //2. Create events for user generated messages
    //Here we are expecting the event to be sent to the backend, instead of emitting the event from the backend to the frontend
    socket.on('sendMessage',(message, callback)=>{
        //Get the user who sent the message
        const user = getUser(socket.id);

        io.to(user.room).emit('message',{user:user.name, text: message});

        callback();

    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        //To inform that the user has left the chat room
        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room...`});
            io.to(user.room).emit('roomData',{room:user.room, users:getUsersInRoom(user.room)});
        }
        console.log('User has left!!!! :(');

    });
}); //Now, we will receive the real-time connection and disconnection logger statements in the console

//Call the router as a Middleware
app.use(router);

//To run the server
server.listen(PORT,()=>console.log(`Server has started on port: ${PORT}`));