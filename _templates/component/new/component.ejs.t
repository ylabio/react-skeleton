---
to: src/<%= path %>/index.tsx
---
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@src/utils/theme';
import './style.less';

function <%= h.inflection.camelize(name) %>(props) {
  return <div className={themes('<%= h.inflection.camelize(name) %>', props.theme)}></div>;
}

<%= h.inflection.camelize(name) %>.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

<%= h.inflection.camelize(name) %>.defaultProps = {
  theme: '',
};

export default React.memo(<%= h.inflection.camelize(name) %>);
