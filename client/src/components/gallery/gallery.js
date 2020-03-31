import React from "react";
import { Redirect } from "react-router-dom"

export const Gallery = (props) => (
    <div className="gallery">
        <div className="pix">
            {props.pixArray ? (
                props.pixArray.map((value) => {
                        return <img src={value.url} alt=""/>
                    })
            ) : (
                <Redirect to="/auth"/>
            )}
        </div>
    </div>
);