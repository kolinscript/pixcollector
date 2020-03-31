import React from "react";
import { Gallery } from "../gallery/gallery";
import { Form } from "../form/form";
import { Route, Redirect } from "react-router-dom";

export class Protected extends React.Component {
    render() {
        if (this.props.showVkLogin) {
            return <Redirect to="/auth"/>
        } else {
            return (
                <Route path="/stock">
                    <Gallery pixArray={this.props.pixArray}/>
                    <Form
                        showVkLogin={this.props.showVkLogin}
                        done={this.props.done}
                        albumSize={this.props.albumSize}
                        count={this.props.count}
                        realonly={this.props.readOnly}
                        handleChange={this.handleChange}
                        all={this.props.all}
                        handleCheckbox={this.handleCheckbox}
                        getPhotos={this.getPhotos}
                    />
                </Route>
            )
        }
    }
}