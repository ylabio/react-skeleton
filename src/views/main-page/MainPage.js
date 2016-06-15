import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';

class MainPage extends Component {

    static propTypes = {

    };

    render() {
        return (
            <div>React web application</div>
        );
    }
}

export default connect(state => ({

}))(MainPage);
