import React from "react";

export const Gallery = (props) => (
    <div className="gallery">
        <div className="pixies">
            {props.pixArray.map((value) => {
                return <img src={value.url} alt="" onClick={props.showPixFullscreen(value.url)}/>
            })}
        </div>
    </div>
);