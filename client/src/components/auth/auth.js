import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

export const Auth = (props) => {
    let {path} = useRouteMatch();
    let countdown = 5;
    while (countdown > 0) {
        setTimeout(() => {
            --countdown;
        }, 1000);
    }

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <div className="main">
                    <h1 className="title">PIXCOLLECTOR</h1>
                    <div className="button login" onClick={props.loginVk}>
                        <div className="label">Login with</div>
                        <div className="logo-vk"></div>
                    </div>
                </div>
            </Route>
            <Route path={`${path}/success`}>
                <div className="main">
                    <h1 className="title">PIXCOLLECTOR</h1>
                    <div className="description">
                        <span>Successfully authorized!</span>
                    </div>
                    <div className="button login" onClick={props.goToStock}>
                        <div className="label">Go to stock in {countdown}</div>
                    </div>
                </div>
            </Route>
        </Switch>
    );
};