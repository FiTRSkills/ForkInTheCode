import logo from "../../logo.svg";
import React, { Component } from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {apiResponse: ""}
    }

    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}));
    }

    componentWillMount() {
        this.callAPI();
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>

                <p>
                    {this.state.apiResponse}
                </p>
            </div>
        );
    }
}
export default Home;
