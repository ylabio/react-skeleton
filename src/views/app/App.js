import React, {Component} from 'react';
import {connect} from 'react-redux';
import {accountActions} from '../../store/actions';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'
import "./style.less";
import Landing from '../landing/Landing.js';
import Main from '../main/Main.js';

class App extends Component {

    componentWillMount() {
        //if (this.props.account.token === null) {
            this.props.dispatch(
                accountActions.account()
            );
        //}
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact={true} path="/" component={Landing}/>
                        <Route path="/main" component={Main}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default connect(state => ({
    account: state.account
}))(App);
