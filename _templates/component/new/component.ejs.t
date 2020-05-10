---
to: src/<%= path %>/index.js
---
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@utils/themes';
import './style.less';

function <%= h.inflection.camelize(name) %>(props) {
  const { theme } = props;
  return <div className={cn('<%= h.inflection.camelize(name) %>', themes('<%= h.inflection.camelize(name) %>', theme))}></div>;
}

<%= h.inflection.camelize(name) %>.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

<%= h.inflection.camelize(name) %>.defaultProps = {
  theme: '',
};

export default React.memo(<%= h.inflection.camelize(name) %>);
