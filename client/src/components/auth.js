import React from "react";
import {Switch, Route, useRouteMatch, BrowserRouter as Router} from "react-router-dom";
import {Footer} from "./footer";

export const Auth = (props) => {
    let {path} = useRouteMatch();

    return (
        <Router>
            <Switch>
                <Route exact path={`${path}`}>
                    <div className="main">
                        <div className="logo"><h1 className="title">PIXCOLLECTOR</h1></div>
                        <h2 className="subtitle">
                            Pixcollector provide to VK users ability to view their pictures from the saved folder and
                            download it all like one ZIP file
                            <div className="button login" onClick={props.loginVk}>
                                <div className="label">Login with</div>
                                <div className="logo-vk"></div>
                            </div>
                        </h2>
                        <h3 className="made-by"><span className="code">👨‍💻</span> by N Koshkarov with <span className="love">❤</span></h3>
                    </div>
                    <Footer/>
                </Route>
                <Route path={`${path}/success`}>
                    <div className="main">
                        <div className="logo"><h1 className="title">PIXCOLLECTOR</h1></div>
                        <div className="description">
                            <span>Successfully authorized!</span>
                            <div className="button login" onClick={props.goToStock}>
                                <div className="label">Go to stock</div>
                            </div>
                        </div>
                        <div className="bottom"></div>
                    </div>
                </Route>
            </Switch>

        </Router>
    );
};