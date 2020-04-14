import React from "react";

export const Header = (props) => (
    <header>
        <div className="profile">
            <a className="user-avatar" href={`https://vk.com/id${props.user.vkId}`} target="_blank" rel="noopener noreferrer">
                <img src={props.user.avatar} alt=""/>
            </a>
            <span className="user-name">{props.user.name}</span>
        </div>
       <div className="settings">
           <span className="icon"></span>
           <span className="label">Menu
           {/*<span>gallery privacy (public / private) - checkbox</span>*/}
           </span>
       </div>
    </header>
);