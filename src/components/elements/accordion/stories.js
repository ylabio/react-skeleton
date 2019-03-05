import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Accordion from './index';

storiesOf('elements/Accordion', module).add(
  'default',
  withInfo()(() => (
    <Accordion onClick={action('onClick')} title={'Title'}>
      Text
    </Accordion>
  )),
);
