import React from 'react';
import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({message:{user, text}, name}) =>{
    let isSentByCurrentUser = false;

    const trimmedName = name.trim().toLowerCase();

    //Check if the current User is the same as the user who sent the message. If yes, then the message has to be blue and 
    // on the right side of the chat window.
    if(user === trimmedName){
        isSentByCurrentUser = true;
    }

    return (
        isSentByCurrentUser ? (
            <div className="messageContainer justifyEnd">
                <p className="sentText pr-10">{trimmedName}</p>
                <div className="messageBox backgroundBlue">
                    <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
                </div>
            </div>
        ) : (
        <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
                <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-10">{user}</p>
        </div>)
    )

};

export default Message;