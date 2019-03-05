import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Button from './index';

storiesOf('elements/Button (кнопка)', module)
  .add(
    'default',
    withInfo()(() => (
      <Button onClick={action('onClick')} title={'Кнопка'}>
        Обычная кнопка
      </Button>
    )),
  )
  .add(
    'square',
    withInfo()(() => (
      <Button onClick={action('onClick')} title={'Кнопка'} theme={['square']}>
        SQ
      </Button>
    )),
  );
