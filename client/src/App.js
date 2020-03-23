import React, { Component } from 'react';
import './App.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVkLogin: true,
        };
        this.loginVk = this.loginVk.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
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
        if (url_current === 'https://pixcollector.herokuapp.com/' || url_current === 'http://localhost:3000/') {
            this.setState(prevState => ({
                showVkLogin: true
            }));
        } else {
            this.setState(prevState => ({
                showVkLogin: false
            }));
            const code = 'https://pixcollector.herokuapp.com/?code=9e6831f7ffe37fce1e'.split('code=')[1];
            console.log(code);
            const AUTH_URL_TOKEN = `https://oauth.vk.com/access_token` +
                `?client_id=7372433` +
                `&client_secret=XgglLIZcB7qB3nNryc8y` +
                `&redirect_uri=https://pixcollector.herokuapp.com` +
                `&code=${code}`;
            console.log(AUTH_URL_TOKEN);
            // window.open(AUTH_URL_TOKEN,"_self");
        }
    }

    loginVk() {
        const AUTH_URL_AUTHORIZE = 'https://oauth.vk.com/authorize' +
            '?client_id=7372433' +
            '&display=popup' +
            '&redirect_uri=https://pixcollector.herokuapp.com' +
            '&scope=friends,photos,offline' +
            '&response_type=code' +
            '&v=5.103';
        window.open(AUTH_URL_AUTHORIZE,"_self")
    }

    render() {
        return (
            <div className={'app'}>
                <div className="auth-wrapper">
                    <h1 className={'title'}>PIXCOLLECTOR</h1>
                    {this.state.showVkLogin && (
                        <div className="button login" onClick={this.loginVk}>
                            <div className="label">Login with</div>
                            <div className="logo-vk">
                                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="19" viewBox="0 0 34 19">
                                    <path
                                        fill="#FFF"
                                        fill-rule="evenodd"
                                        d="M31.5584982,1.28655527 C31.7808894,0.544942969 31.5584984,0 30.500061,0 L27.000061,0 C26.1101263,0 25.6998536,0.470750876 25.4773391,0.989848628 C25.4773391,0.989848628 23.6974695,5.32823432 21.1760494,8.14629935 C20.3603068,8.96204202 19.9894697,9.2215909 19.5445024,9.2215909 C19.3220495,9.2215909 18.9883086,8.96204202 18.9883086,8.22049144 L18.9883086,1.28655527 C18.9883086,0.396620508 18.7417351,0 18.000061,0 L12.500061,0 C11.943929,0 11.6094667,0.413039057 11.6094667,0.804491844 C11.6094667,1.64813371 12.8701151,1.84268735 13.000061,4.21584672 L13.000061,9.36997508 C13.000061,10.5 12.7959847,10.7048772 12.3510173,10.7048772 C11.1644994,10.7048772 8.27829116,6.34711025 6.56650306,1.36068564 C6.23103383,0.391497427 5.89456337,0 5.00006104,0 L1.50006104,0 C0.500061035,0 0.300048828,0.470750876 0.300048828,0.989848628 C0.300048828,1.91687944 1.48662852,6.514814 5.82495248,12.5959115 C8.71714788,16.7488169 12.7920612,19 16.500061,19 C18.7248362,19 19.000061,18.5 19.000061,17.6387517 L19.000061,14.5 C19.000061,13.5 19.2108231,13.3004277 19.9153394,13.3004277 C20.4344371,13.3004277 21.3243719,13.5599766 23.4008863,15.5622989 C25.773984,17.9353966 26.1652206,19 27.500061,19 L31.000061,19 C32.000061,19 32.500061,18.5 32.2116188,17.513278 C31.8959765,16.5298527 30.7629505,15.1030336 29.259531,13.4116541 C28.4437266,12.447589 27.2201126,11.4093935 26.8492755,10.8901723 C26.3301778,10.2228138 26.4785003,9.92610716 26.8492755,9.33287904 C26.8492755,9.33287904 31.1135309,3.32591196 31.5584982,1.28655527 Z"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
                <footer>
                    <div className={'social'}>
                        <div className="link"><a className="github" href="https://github.com/kolinscript" target="_blank" rel="noopener noreferrer"></a></div>
                        <div className="link"><a className="telega" href="https://t.me/nkoshkarov" target="_blank" rel="noopener noreferrer"></a></div>
                        <div className="link"><a className="vk" href="https://vk.com/koshkarovnik" target="_blank" rel="noopener noreferrer"></a></div>
                        <div className="link"><a className="instagram" href="http://instagram.com/kolinvision" target="_blank" rel="noopener noreferrer"></a></div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;

