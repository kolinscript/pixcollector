import React from "react";
import {Switch, Route, Link, useRouteMatch, BrowserRouter as Router} from "react-router-dom";
import StockItemComponent from "./stock-item.component";
import {Header} from "../shared/header";

export const StockComponent = (props) => {
    let {path} = useRouteMatch();
    const id = localStorage.getItem('id');

    return (
        <Router>
            <Switch>
                <Route exact path={`${path}`}>
                    <Header user={props.user}/>
                    <div className="stock">
                        <div className="stock-card self">
                            <div className="logo"> </div>
                            <div className="subtitle">my stock</div>
                            <Link to={`/stock/${id}`}> </Link>
                        </div>
                        <div className="stock-card users">
                            <div className="logo"> </div>
                            <div className="subtitle">users stocks</div>
                            <Link to={`/stocks`}> </Link>
                        </div>
                    </div>
                </Route>

                <Route path={`${path}/:id`}>
                    <StockItemComponent
                        user={props.user}
                    />
                </Route>
            </Switch>

        </Router>
    );
};