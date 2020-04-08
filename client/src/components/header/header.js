import React from "react";

export const Header = (props) => (
    <header>
        <div className="player"><span className="icon">⚙</span><span className="label">Music</span></div>
        <div className="profile"><span className="user-avatar">👨</span><span className="user-name">Nikolai Koshkarov</span></div>
       <div className="settings"><span className="icon">⚙</span><span className="label">Settings</span></div>
    </header>
);