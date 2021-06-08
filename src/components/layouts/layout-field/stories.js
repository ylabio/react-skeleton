import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import LayoutField from './index';

storiesOf('layouts/LayoutField', module).add(
  'default',
  withInfo()(() => <LayoutField label={'{label}'} input={'{input}'} />),
);
