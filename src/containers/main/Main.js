import React, {Component} from 'react';
import {connect} from 'react-redux';
import "./style.less";
import {Link} from 'react-router-dom';

class Main extends Component {

  componentWillMount() {


  }

  render() {
    return (
      <div className="Main">
        <h1>Main page</h1>
        <div>
          <Link to="/">Go to landing</Link>
        </div>
      </div>
    );
  }
}

export default connect(state => ({}))(Main);