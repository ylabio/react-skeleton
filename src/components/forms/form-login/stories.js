import React from 'react';
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';
import { action } from '@storybook/addon-actions';

import FormLogin from './index';

const state = {
  data: { login: 'test@example.com', password: '123456' },
  errors: { login: 'Плохой логин' },
};

storiesOf('forms/FormLogin', module).add(
  'default',
  withState(state)(({ store }) => (
    <FormLogin
      data={store.state.data}
      errors={store.state.errors}
      onChange={data => store.set({ data })}
      onSubmit={action('submit')}
    />
  )),
);
