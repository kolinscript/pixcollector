import React from "react";

export const Gallery = (props) => (
    <div className="gallery">
        <div className="pix">
            {props.pixArray.map((value) => {
                return <img src={value.url} alt=""/>
            })}
        </div>
    </div>
);