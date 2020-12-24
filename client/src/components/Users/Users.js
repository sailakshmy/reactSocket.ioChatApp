import React from 'react';
import onlineIcon from '../../Icons/onlineIcon.png';


const Users = ({users}) =>(
    
    <div>
    { 
        users ? (
            <div>
                <h5>Currently active users:</h5>
                <div>
                    <ol className="activeContainer">
                    {users.map(({name},index)=>(
                        <li className="activeItem" key={index}>
                            {name}
                            {console.log("Users:" + users)}
                            {console.log(name)}
                            <img src={onlineIcon} alt="online"/>
                        </li>
                    ))}
                    </ol>
                </div>
            </div>
        ) : null
    }
    </div>
)

export default Users;
