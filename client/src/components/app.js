import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import './app.scss';
import axios from 'axios';
import Slider from "@material-ui/core/Slider";
import {Auth} from "./auth";
import {Header} from "./header";
import {Stock} from "./stock";
import {Gallery} from "./gallery";
import {Viewer} from "./viewer";
import httpService from "../http-service";
import Tooltip from "@material-ui/core/Tooltip";

httpService.setupInterceptors();

// TODO sliders to manage pixies size in album view
//      fullscreen pop-up component for single pix
//      paginator for  album view
//      new view type - table (which provide selectivity pix download)
//      save actual pix links array on back-end -> create clients galleries available by links
//      (pixcollector.com/gallery/1) to share with

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVkLogin: true,
            user: {
                albumSize: 100,
                pixArray: [],
                token: '',
            },
            readOnly: false,
            countFrom: 1,
            countTo: 42,
            all: false,
            fullScreen: false,
            pixUrl: ''
        };
        this.loginVk = this.loginVk.bind(this);
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
            // fetch AUTH token on success authentication (contains in user obj)
            axios.get(`/api/v1/auth/success`)
                .then((response) => {
                    if (!response.data.body.user) {
                        this.setState({showVkLogin: true});
                        window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
                    } else if (response.data.body.user) {
                        localStorage.setItem('token', response.data.body.user.token);
                        localStorage.setItem('id', response.data.body.user.vkId);
                        this.setState({user: response.data.body.user, showVkLogin: false});
                    }
                })
                .catch(err => console.log(err));
        } else if (url_current === 'https://pixcollector.herokuapp.com/stock' || url_current === 'http://localhost:3000/stock') { // home STOCK page
            this.setState({showVkLogin: false});
            // fetch user data
            const id = localStorage.getItem('id');
            axios.get(`/api/v1/user?id=${id}`)
                .then((response) => {
                    console.log(response);
                    if (!response.data.body.user) {
                        this.setState({showVkLogin: true});
                        window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
                    } else if (response.data.body.user) {
                        console.log(response.data);
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
    //
    // getPhotos() {
    //     // fetch array with the pixies links
    //     axios.get(`/api/v1/photos?countFrom=${this.state.countFrom}&countTo=${this.state.countTo}`)
    //         .then((response) => {
    //             if (response.data.body.pixArray) {
    //                 this.setState(prevState => ({
    //                     pixArray: response.data.body.pixArray,
    //                 }));
    //             }
    //         })
    //         .catch(err => console.log(err));
    // }

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
        const handleChangeRange = (event, newValue) => {
            if (newValue) {
                this.setState(prevState => ({
                    countFrom: newValue[0],
                    countTo: newValue[1],
                }));
            }
        };
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
                        <Header user={this.state.user}/>
                        <Stock />
                    </Route>
                    <Route path="/gallery">
                        <Header user={this.state.user}/>
                        <Gallery
                            pixArray={this.state.user.pixArray}
                            cutFrom={this.state.countFrom}
                            cutTo={this.state.countTo}
                            showPixFullscreen={this.showPixFullscreen}
                        />
                        {(this.state.fullScreen) && (
                            <Viewer
                                url={this.state.pixUrl}
                                fullScreenClose={this.fullScreenClose}
                            />
                        )}
                        <div  className={`gallery-range-slider ${this.state.readOnly ? "readOnly" : ""}`}>
                            <Slider
                                defaultValue={[0, this.state.user.albumSize]}
                                min={1}
                                step={1}
                                max={this.state.user.albumSize}
                                value={[+this.state.countFrom, +this.state.countTo]}
                                valueLabelDisplay="auto"
                                ValueLabelComponent={ValueLabelComponent}
                                onChange={handleChangeRange}
                            />
                        </div>
                        {/*<Form*/}
                        {/*    showVkLogin={this.state.showVkLogin}*/}
                        {/*    done={this.state.done}*/}
                        {/*    albumSize={this.state.user.albumSize}*/}
                        {/*    countFrom={this.state.countFrom}*/}
                        {/*    countTo={this.state.countTo}*/}
                        {/*    readOnly={this.state.readOnly}*/}
                        {/*    handleChange={this.handleChange}*/}
                        {/*    all={this.state.all}*/}
                        {/*    handleCheckbox={this.handleCheckbox}*/}
                        {/*    getPhotos={this.getPhotos}*/}
                        {/*    goToLogin={this.goToLogin}*/}
                        {/*/>*/}
                    </Route>
                    <Route path="*">
                        <Redirect to="/auth" />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

function ValueLabelComponent(props) {
    const { children, open, value } = props;
    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

export default App;
