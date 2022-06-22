import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
import themes from '@src/utils/themes';

interface Props {
  theme: string | string[];
  children?: React.ReactNode;
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

function LayoutPage(props: Props) {
  return (
    <div className={themes('LayoutPage', props.theme)}>
      <div className="LayoutPage__header">{props.header}</div>
      <div className="LayoutPage__content">{props.children || props.content}</div>
      <div className="LayoutPage__footer">{props.footer}</div>
    </div>
  );
}

LayoutPage.propTypes = {
  header: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // можно передать несколько тем через пробел или массивом
};

LayoutPage.defaultProps = {
  theme: '',
};

export default React.memo(LayoutPage);
