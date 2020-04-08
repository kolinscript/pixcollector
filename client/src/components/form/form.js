import React from "react";

export const Form = (props) => (
    (!props.done) && (
        <div className="main">
            {(!props.done) && (
                <div className="logo"><h1 className="title">PIXCOLLECTOR</h1></div>
            )}
            {(!props.done) && (
                <div className="form">
                    <form onSubmit={props.getPhotos}>
                        <div className="title">
                            <span>You've got <span className="albumSize">{props.albumSize}</span> pix collected. </span>
                            <span>Enter the range of pixies you want to collect,</span>
                            <span>or hit the circle to grab the whole thing. </span>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <span className="from">from</span>
                                <input type="number"
                                       name="countFrom"
                                       min="1"
                                       value={props.countFrom}
                                       readOnly={props.readOnly}
                                       onChange={props.handleChange}
                                />
                            </div>
                            <div className="input">
                                <span className="to">to</span>
                                <input type="number"
                                       name="countTo"
                                       value={props.countTo}
                                       readOnly={props.readOnly}
                                       onChange={props.handleChange}
                                />
                            </div>
                            <div className="checkbox">
                                <input type="checkbox"
                                       name="all"
                                       id="checkbox"
                                       checked={props.all}
                                       onChange={props.handleCheckbox}
                                />
                                <label htmlFor="checkbox">all</label>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {(!props.done) && (
                <div className="button" onClick={props.getPhotos}>
                    <div className="label">See pixies</div>
                </div>
            )}
        </div>
    )
);