import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';

import Input from './index';

storiesOf('elements/Input', module).add(
  'default',
  withState({ value: 'text' })(
    withInfo(`Текстовое поле вода`)(({ store }) => (
      <Input value={store.state.value} onChange={value => store.set({ value })} />
    )),
  ),
);
