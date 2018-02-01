import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Header from './index';

storiesOf('elements/Header (шапка)', module)
  .add('default', withInfo()(() => (
    <Header
      left={"{left}"}
      right={"{right}"}
    >
      {"{children}"}
    </Header>
  )));