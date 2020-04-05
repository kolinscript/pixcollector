import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './app.scss';
import { Footer } from "../footer/footer";
import { Auth } from "../auth/auth";
import { Gallery } from "../gallery/gallery";
import { Form } from "../form/form";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVkLogin: true,
            user: {},
            pixArray: [],
            done: false,
            readOnly: false,
            albumSize: 0,
            count: '',
            all: false,
        };
        this.loginVk = this.loginVk.bind(this);
        this.getPhotos = this.getPhotos.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
    }

    componentDidMount() { window.addEventListener('load', this.handleLoad); }

    componentWillUnmount() { window.removeEventListener('load', this.handleLoad) }

    handleLoad() {
        const url_current = window.location.href;
        console.log(url_current);
        if (url_current === 'https://pixcollector.herokuapp.com/auth' || url_current === 'http://localhost:3000/auth') { // AUTH page
            this.setState( { showVkLogin: true });
        } else if (url_current === 'https://pixcollector.herokuapp.com/stock' || url_current === 'http://localhost:3000/stock') { // home STOCK page
            this.setState( { showVkLogin: false });
            // fetch home data
            fetch(`/api/v1/stock`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json', 'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then((data) => {
                    console.log(data);
                    if (!data.body.user) {
                        this.setState( { showVkLogin: true });
                        window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
                    } else if (data.body.user) {
                        this.setState(  { user: data.body.user, showVkLogin: false });
                    }
                })
                .catch(error => console.log(error));
        }
    }

    loginVk() {
        const AUTH_URL_AUTHORIZE = 'https://oauth.vk.com/authorize' +
            '?client_id=7372433' +
            '&display=page' +
            '&redirect_uri=https://pixcollector.herokuapp.com/api/v1/auth' +
            '&scope=friends,photos,offline' +
            '&response_type=code' +
            '&v=5.103';
        window.open(AUTH_URL_AUTHORIZE,"_self")
    }

    getPhotos() {
        fetch(`/api/v1/photos?count=${this.state.count}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json', 'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState(prevState => ({
                    pixArray: data.body,
                    done: true
                }));
            })
            .catch(error => console.log(error));
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState( {
            [name]: value
        }, () => {
            console.log(this.state);
        });
    }

    handleCheckbox(event) {
        const name = event.target.name;
        const value = event.target.checked;
        console.log(value);
        if (value) {
            this.setState(prevState => ({
                count: this.state.user.albumSize,
                readOnly: true
            }));
        } else {
            this.setState(prevState => ({
                count: '',
                readOnly: false
            }));
        }
        this.setState({
            [name]: value
        }, () => {
            console.log(this.state);
        });
    }

    goToLogin() {
        window.location = 'https://pixcollector.herokuapp.com/auth';
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/auth"><Auth showVkLogin={this.state.showVkLogin} loginVk={this.loginVk}/></Route>
                    <Route path="/stock">
                        <Gallery pixArray={this.state.pixArray}/>
                        <Form
                            showVkLogin={this.state.showVkLogin}
                            done={this.state.done}
                            albumSize={this.state.user.albumSize}
                            count={this.state.count}
                            realonly={this.state.readOnly}
                            handleChange={this.handleChange}
                            all={this.state.all}
                            handleCheckbox={this.handleCheckbox}
                            getPhotos={this.getPhotos}
                            goToLogin={this.goToLogin}
                        />
                    </Route>
                    <Route path="*">
                        <Redirect to="/auth"/>
                    </Route>
                </Switch>
                <Footer/>
            </Router>
        );
    }
}

export default App;

