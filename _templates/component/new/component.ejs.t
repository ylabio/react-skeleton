---
to: src/<%= path %>/index.js
---
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@utils/themes';
import './style.less';

const <%= h.inflection.camelize(name) %> = React.memo(props => {
  const { theme } = props;
  return <div className={cn('<%= h.inflection.camelize(name) %>', themes('<%= h.inflection.camelize(name) %>', theme))} />;
});

<%= h.inflection.camelize(name) %>.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

<%= h.inflection.camelize(name) %>.defaultProps = {
  theme: '',
};

export default <%= h.inflection.camelize(name) %>;
