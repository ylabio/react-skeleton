import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import LayoutPage from './index';

storiesOf('layouts/LayoutPage', module)
  .addDecorator(story => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{story()}</div>
  ))
  .add('default', () => (
    <LayoutPage
      header={<div>{'{header}'}</div>}
      content={<div>{'{content}'}</div>}
      footer={<div>{'{footer}'}</div>}
    />
  ));
