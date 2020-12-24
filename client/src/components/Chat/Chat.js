import React,{useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Infobar from '../Infobar/Infobar';
import './Chat.css';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import Users from '../Users/Users';

let socket; 
const Chat = ({location}) =>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState('');
    const ENDPOINT = 'localhost:5000';
    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);
        //console.log(urlData);
        //console.log(location.search);
        //console.log(name, room);
        socket = io(ENDPOINT,{ transport : ['websocket'] });
        setName(name);
        setRoom(room);
        //console.log(socket);        
        socket.emit('join',{name,room},()=>{
           // alert(error);
        });//Now this event has to be recieved by the backend
        //To complete the useEffect Hook, we need to return something which will be used for unmounting the component
        return()=>{
            socket.emit('disconnect');
            socket.off();//This will turn off this one instance of a client socket 
        }
    },[ENDPOINT, location.search]);//Prior to adding the array as the second parameter, we were getting 2 instances of Socket

    useEffect(()=>{//This hook is to handle messages
        //Listen for messages
        socket.on('message',(message)=>{
            //We can track of the messages via state.
            setMessages([...messages, message]);//This is adding the messages sent by the admin or anyone else to the messages array
        });
        //To get the total number of users in the room currently
        socket.on('roomData',({users})=>setUsers(users));
    },[messages]);
    
    //function for sending messages
    const sendMessage = (event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message ,()=>setMessage(''));
        }
    }
    console.log(message, messages);//the messages here contains the user and the text property
    return(
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <div className="container ml-10">
                <Users users={users}/>
            </div>
        </div>
    );
};

export default Chat;