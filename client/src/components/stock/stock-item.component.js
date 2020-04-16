import React, {Component} from "react";
import axios from "axios";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import {Header} from "../shared/header";
import {Gallery} from "../shared/gallery";
import {Viewer} from "../shared/viewer";

class StockItemComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countFrom: 1,
            countTo: 100,
            user: {
                albumSize: 100,
                pixArray: [],
            },
            fullScreen: false,
            pixUrl: '',
            readOnly: false,
        };
        this.handleLoad = this.handleLoad.bind(this);
        this.showPixFullscreen = this.showPixFullscreen.bind(this);
        this.fullScreenClose = this.fullScreenClose.bind(this);
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const url_current = window.location.href;
        console.log('prevProps: ', prevProps);
        console.log('prevState: ', prevState);
        console.log('url_current: ', url_current);
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad)
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

    handleLoad() {
        const id = +window.location.href.substring(window.location.href.indexOf('stock/') + 6);
        axios.get(`/api/v1/user?id=${id}`)
            .then((response) => {
                console.log(response);
                if (!response.data.body.user) {
                    // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
                } else if (response.data.body.user) {
                    console.log(response.data);
                    this.setState({user: response.data.body.user});
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        const handleChangeRange = (event, newValue) => {
            if (newValue) {
                this.setState({countFrom: newValue[0], countTo: newValue[1],});
            }
        };
        return (
            <div className="gallery-wrapper">
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
                <div className={`gallery-range-slider ${this.state.readOnly ? "readOnly" : ""}`}>
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
            </div>
        );
    }
}

function ValueLabelComponent(props) {
    const {children, open, value} = props;
    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

export default StockItemComponent;