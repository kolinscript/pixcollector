import React from "react";

export const Form = (props) => (
    <div className="main">
        <h1 className="title">PIXCOLLECTOR</h1>
        {(!props.showVkLogin && !props.done) && (
            <form onSubmit={props.getPhotos}>
                <div className="title">
                    <span>You've got <span className="albumSize">{props.albumSize}</span> pix collected. </span>
                    <span>Enter the number of pixies you want to collect </span>
                    <span>or check the box to grab the whole thing. </span>
                </div>
                <div className="inputs">
                    <input type="number"
                           name="count"
                           value={props.count}
                           readOnly={props.readOnly}
                           onChange={props.handleChange}
                    />
                    <div className="checkbox">
                        <input type="checkbox"
                               name="all"
                               id="checkbox"
                               checked={props.all}
                               onChange={props.handleCheckbox}
                        />
                        <label htmlFor="checkbox"></label>
                    </div>
                </div>
            </form>
        )}
        {(!props.showVkLogin && !props.done) && (
            <div className="button login" onClick={props.getPhotos}>
                <div className="label">Get photos</div>
            </div>
        )}
        {(props.done) && (
            <a className="button login" href="/api/v1/download/pixcollector.zip" download>
                <div className="label">Download</div>
            </a>
        )}
        {(props.showVkLogin) && (
            <div className="button login" onClick={props.goToLogin}>
                <div className="label">Go to login page</div>
            </div>
        )}
    </div>
);