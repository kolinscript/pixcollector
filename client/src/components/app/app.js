import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import './app.scss';
import axios from 'axios';
import {Header} from "../header/header";
import {Auth} from "../auth/auth";
import {Gallery} from "../gallery/gallery";
import {Form} from "../form/form";
import {Viewer} from "../viewer/viewer";
import httpService from "../../http-service";

httpService.setupInterceptors();

// TODO sliders to manage pixies size in album view
// TODO fullscreen pop-up component for single pix
// TODO paginator for  album view
// TODO new view type - table (which provide selectivity pix download)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVkLogin: true,
            user: {
                albumSize: 0
            },
            token: '',
            pixArray: [],
            done: false,
            readOnly: false,
            countFrom: '',
            countTo: '',
            all: false,
            fullScreen: false,
            pixUrl: ''
        };
        this.loginVk = this.loginVk.bind(this);
        this.getPhotos = this.getPhotos.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
        this.goToStock = this.goToStock.bind(this);
        this.showPixFullscreen = this.showPixFullscreen.bind(this);
        this.fullScreenClose = this.fullScreenClose.bind(this);
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad)
    }

    handleLoad() {
        const url_current = window.location.href;
        console.log(url_current);
        if (url_current === 'https://pixcollector.herokuapp.com/auth' || url_current === 'http://localhost:3000/auth') { // AUTH page
            this.setState({showVkLogin: true});
        } else if (url_current === 'https://pixcollector.herokuapp.com/auth/success' || url_current === 'http://localhost:3000/auth/success') {
            this.setState({showVkLogin: true});
            // fetch AUTH token on success authentication
            axios.get(`/api/v1/auth/success`)
                .then((response) => {
                    if (!response.data.body.token) {
                        this.setState({showVkLogin: true});
                        window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
                    } else if (response.data.body.token) {
                        localStorage.setItem('token', response.data.body.token);
                        this.setState({token: response.data.body.token, showVkLogin: false});
                    }
                })
                .catch(err => console.log(err));
        } else if (url_current === 'https://pixcollector.herokuapp.com/stock' || url_current === 'http://localhost:3000/stock') { // home STOCK page
            this.setState({showVkLogin: false});
            // fetch home data
            axios.get(`/api/v1/stock`)
                .then((response) => {
                    if (!response.data.body.user) {
                        this.setState({showVkLogin: true});
                        window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
                    } else if (response.data.body.user) {
                        this.setState({user: response.data.body.user, showVkLogin: false});
                    }
                })
                .catch(err => console.log(err));
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
        window.open(AUTH_URL_AUTHORIZE, "_self")
    }

    getPhotos() {
        // fetch array with the pixies links
        axios.get(`/api/v1/photos?countFrom=${this.state.countFrom}&countTo=${this.state.countTo}`)
            .then((response) => {
                if (response.data.body.pixArray) {
                    this.setState(prevState => ({
                        pixArray: response.data.body.pixArray,
                        done: true
                    }));
                }
            })
            .catch(err => console.log(err));
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleCheckbox(event) {
        const name = event.target.name;
        const value = event.target.checked;
        if (value) {
            this.setState(prevState => ({
                countFrom: 1,
                countTo: this.state.user.albumSize,
                readOnly: true
            }));
        } else {
            this.setState(prevState => ({
                countFrom: '',
                countTo: '',
                readOnly: false
            }));
        }
        this.setState({
            [name]: value
        });
    }

    goToLogin() {
        window.location = 'https://pixcollector.herokuapp.com/auth';
    }

    goToStock() {
        window.location = 'https://pixcollector.herokuapp.com/stock';
    }

    showPixFullscreen(pixUrl) {
        console.log('showPixFullscreen pixUrl', pixUrl);
        if (pixUrl) {
            this.setState(() => ({
                fullScreen: true,
                pixUrl: pixUrl
            }));
        } else {
            this.setState(() => ({
                fullScreen: false,
                pixUrl: ''
            }));
        }
    }

    fullScreenClose() {
        this.setState(() => ({
            fullScreen: false,
            pixUrl: ''
        }));
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/auth">
                        <Auth
                            showVkLogin={this.state.showVkLogin}
                            goToStock={this.goToStock}
                            loginVk={this.loginVk}
                        />
                    </Route>
                    <Route path="/stock">
                        <Header/>
                        <Gallery
                            pixArray={this.state.pixArray}
                            done={this.state.done}
                            showPixFullscreen={this.showPixFullscreen}
                        />
                        <Form
                            showVkLogin={this.state.showVkLogin}
                            done={this.state.done}
                            albumSize={this.state.user.albumSize}
                            countFrom={this.state.countFrom}
                            countTo={this.state.countTo}
                            readOnly={this.state.readOnly}
                            handleChange={this.handleChange}
                            all={this.state.all}
                            handleCheckbox={this.handleCheckbox}
                            getPhotos={this.getPhotos}
                            goToLogin={this.goToLogin}
                        />
                        {(this.state.fullScreen) && (
                            <Viewer
                                url={this.state.pixUrl}
                                fullScreenClose={this.fullScreenClose}
                            />
                        )}
                    </Route>
                    <Route path="*">
                        <Redirect to="/auth" />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;

