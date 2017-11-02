import React, {Component} from 'react';
import {connect} from 'react-redux';
import "./style.less";
import {Link} from 'react-router-dom';

class Landing extends Component {

  componentWillMount() {

  }

  render() {
    return (
      <div className="Landing">
        <div>
          <h1>Landing page</h1>
          <Link to="/main">Go to main</Link>
        </div>
      </div>
    );
  }
}

export default connect(state => ({}))(Landing);