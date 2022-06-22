import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { BrowserRouter } from 'react-router-dom';

import Logo from './index.tsx';

storiesOf('elements/Logo', module)
  .addDecorator(story => (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#111',
        display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center'
      }}
    >
      {story()}
    </div>
  ))
  .add(
    'default',
    withInfo()(() => (
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    )),
  );
