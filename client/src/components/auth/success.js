import React from "react";

export const AuthSuccess = (props) => (
    <div className="main">
        <h1 className="title">PIXCOLLECTOR</h1>
        <div className="button login" onClick={props.goToStock}>
            <div className="label">Successfully authorized!</div>
        </div>
    </div>
);