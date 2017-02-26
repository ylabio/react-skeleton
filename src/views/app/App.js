import React, {Component} from 'react';
import {connect} from 'react-redux';
import {accountActions} from '../../store/actions';

class App extends Component {

    componentWillMount() {
        console.log('fff');
        //if (this.props.account.token === null) {
            this.props.dispatch(
                accountActions.account()
            );
        //}
    }

    render() {
        return (
            <div className="App">
                {this.props.children}
            </div>
        );
    }
}

export default connect(state => ({
    account: state.account
}))(App);