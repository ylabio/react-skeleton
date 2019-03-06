import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LayoutContent from '@components/layouts/layout-content';

class NotFound extends Component {
  render() {
    return (
      <LayoutContent>
        <h1>404</h1>
        <p>Страница не найдена</p>
        <Link to="/">На главную</Link>
      </LayoutContent>
    );
  }
}

export default connect()(NotFound);
