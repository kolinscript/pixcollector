import React from "react";
import ReactDOM from "react-dom";
import {Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import './index.scss';
import App from './components/app/app';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();
const rootElement = document.getElementById("root");

ReactDOM.render(
    <Router history={history}>
        <App/>
    </Router>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
