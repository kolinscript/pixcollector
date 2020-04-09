import React from "react";

export const Gallery = (props) => (
    <div className="gallery">
        <div className="pixies">
            {props.pixArray.map((value) => {
                return (
                    <div className="pix">
                        <img src={value.url} alt="" onClick={() => props.showPixFullscreen(value.url)}/>
                        <div className="selector"></div>
                    </div>
                )
            })}
        </div>
        {(props.done) && (
            <a className="button bottomed" href="/api/v1/download/pixcollector.zip" download>
                <div className="label">Download</div>
            </a>
        )}
    </div>
);