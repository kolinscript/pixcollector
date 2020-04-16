import React from "react";
import {Switch, Route, useRouteMatch, BrowserRouter as Router} from "react-router-dom";
import {Footer} from "../shared/footer";

export const AuthComponent = (props) => {
    let {path} = useRouteMatch();

    function loginVk() {
        const AUTH_URL_AUTHORIZE = 'https://oauth.vk.com/authorize' +
            '?client_id=7372433' +
            '&display=page' +
            '&redirect_uri=https://pixcollector.herokuapp.com/api/v1/auth' +
            '&scope=friends,photos,offline' +
            '&response_type=code' +
            '&v=5.103';
        window.open(AUTH_URL_AUTHORIZE, "_self")
    }

    return (
        <Router>
            <Switch>
                <Route exact path={`${path}`}>
                    <div className="main">
                        <div className="logo"><h1 className="title">COLLECTOR</h1></div>
                        <h2 className="subtitle">
                            Collector provide to VK users ability to view their pictures from the saved folder and
                            download it all like one ZIP file
                            <div className="button login" onClick={loginVk}>
                                <div className="label">Login with</div>
                                <div className="logo-vk"> </div>
                            </div>
                        </h2>
                        <h3 className="made-by"><span className="code" role="img" aria-label="Made">👨‍💻</span> by Nikolai Koshkarov with <span className="love" role="img" aria-label="love">❤</span></h3>
                    </div>
                    <Footer/>
                </Route>
                <Route path={`${path}/success`}>
                    <div className="main">
                        <div className="logo"><h1 className="title">COLLECTOR</h1></div>
                        <div className="description">
                            <span>Successfully authorized!</span>
                            <div className="button login">
                            {/*<div className="button login" onClick={props.goToStock}>*/}
                                <div className="label">Go to Stock</div>
                            </div>
                        </div>
                        <div className="bottom"> </div>
                    </div>
                </Route>
            </Switch>

        </Router>
    );
};