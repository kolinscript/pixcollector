import React from "react";

export const Viewer = (props) => (
    <div className="fullScreen">
        <div className="pix">
            <img src={props.url} alt=""/>
            <div className="selector"></div>
        </div>
    </div>
);