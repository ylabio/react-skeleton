import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Icon from '../../../index';

storiesOf('elements/Icon', module)
  .add('camera', () => (
    <Icon
      onClick={action('onClick')}
      name='arrow'
      hover={true}
    />
  ))
  .add('play', () => (
    <Icon
      onClick={action('onClick')}
      name='fb'
      hover={true}
    />
  ))
  .add('watch', () => (
    <Icon
      onClick={action('onClick')}
      name='ok'
      hover={true}
      hoverText='u can watch'
    />
  ))
  .add('like', () => (
    <Icon
      onClick={action('onClick')}
      name='twitter'
      hover={true}
    />
  ))
  .add('currency', () => (
    <Icon
      onClick={action('onClick')}
      name='vk'
    />
  ))
  .add('menu', () => (
    <Icon
      onClick={action('onClick')}
      name='vk'
    />
  ));