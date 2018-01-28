import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import LayoutPage from './index';

storiesOf('layouts/LayoutPage (страница)', module)
  .add('default', () => (
    <LayoutPage
      header={<div>header</div>}
      content={<div>content</div>}
      footer={<div>footer</div>}
    />
  ));