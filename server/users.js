/**This file has helper functions that will help us manage users, manage users joining in, signing out, removing users,
 * getting users, adding users, keeping track of which users are in which rooms. These will be used in index.js
 */
const users = [];

const addUser = ({id,name,room}) =>{//id is the Socket id
    //We need to change the name and room that the user enters
    //I.e - if the user wants to enter the MCU room, then the name of the room should be mcu
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Check if there is an existing user with the username(To see duplicate usernames) in the same room
    const existingUser = users.find(user=> user.room === room && user.name === name);
    if(existingUser){
        return {
            error: 'Username has been taken. Please change the username to enter the room as there is an existing user with the same name',
        }
    }

    //If no existing user, then create the user
    const user = {id, name, room};
    users.push(user);
    return {user};

};

const removeUser = (id)=>{
    //Try to find the user with the specific socket Id by checking if there is an existing user with that id
    const index = users.findIndex(user=> user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
};

const getUser =(id)=>{
    //Search for the user using the socket Id and then return it
    return users.find(user=> user.id === id)

};

const getUsersInRoom = (room) =>{
    return users.filter(user => user.room === room)
};

module.exports = {addUser, removeUser, getUser, getUsersInRoom}