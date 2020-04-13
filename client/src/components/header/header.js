import React from "react";

export const Header = (props) => (
    <header>
        <div className="profile"><span className="user-avatar"><img src={props.user.avatar} alt=""/></span><span className="user-name">{props.user.name}</span></div>
       <div className="settings"><span className="icon"></span><span className="label">Menu</span></div>
    </header>
);