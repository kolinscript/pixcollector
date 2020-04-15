import React from "react";
import {Switch, Route, Link, useRouteMatch, useParams, BrowserRouter as Router} from "react-router-dom";

export const Stock = (props) => {
    let {path} = useRouteMatch();
    const id = localStorage.getItem('id');

    return (
        <Router>
            <Switch>
                <Route exact path={`${path}`}>
                    <div className="stock">
                        <div className="stock-card self">
                            <div className="logo"></div>
                            <div className="subtitle">my stock</div>
                            <Link to={`/gallery/${id}`}></Link>
                        </div>
                        <div className="stock-card users">
                            <div className="logo"></div>
                            <div className="subtitle">users stocks</div>
                            <Link to={`/stock/public`}></Link>
                        </div>
                    </div>
                </Route>

                <Route path={`${path}/public`}>
                    <div className="public">public</div>
                </Route>
            </Switch>

        </Router>
    );
};