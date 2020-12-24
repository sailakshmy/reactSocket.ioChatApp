import React from 'react';
import './Input.css';

const Input = ({message, setMessage, sendMessage})=>(
    <form className="form">
        <input type="text" value={message} onChange={(event)=> setMessage(event.target.value)}
                        onKeyPress={(event)=> event.key === 'Enter' ? sendMessage(event): null}
                        className="input" placeholder="Type a message"/>
        <button className="sendButton" onClick={(event)=> sendMessage(event)}>Send</button>
    </form>

);

export default Input;
