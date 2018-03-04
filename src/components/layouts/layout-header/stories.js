import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import LayoutHeader from './index';

storiesOf('layouts/LayoutHeader', module)
  .add('default', withInfo()(() => (
    <LayoutHeader
      left={"{left}"}
      right={"{right}"}
    >
      {"{children}"}
    </LayoutHeader>
  )));