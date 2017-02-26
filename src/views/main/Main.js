import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import "./style.less";


class Main extends Component {

    componentWillMount() {


    }

    render() {
        console.log('00');
        return (
            <div className="Main">
5
            </div>    
        );
    }
}

export default connect(state => ({

}))(Main);