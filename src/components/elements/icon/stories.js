import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Icon from './index';

storiesOf('elements/Icon', module)
  .add('fb', () => (
    <Icon
      onClick={action('onClick')}
      name='fb'
      hover={true}
    />
  ))
  .add('ok', () => (
    <Icon
      onClick={action('onClick')}
      name='ok'
      hover={true}
    />
  ))
  .add('twitter', () => (
    <Icon
      onClick={action('onClick')}
      name='twitter'
      hover={true}
      hoverText='u can watch'
    />
  ))
  .add('vk', () => (
    <Icon
      onClick={action('onClick')}
      name='vk'
      hover={true}
    />
  ))
  .addDecorator(story => (
    <div style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#111',
      display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center'
    }}>
      {story()}
    </div>
  ))
  .add('menu', () => (
    <Icon
      onClick={action('onClick')}
      name='menu'
    />
  ))
  .add('arrow-next', () => (
    <Icon
      onClick={action('onClick')}
      name='arrow-next'
    />
  ))
  .add('arrow-prev', () => (
    <Icon
      onClick={action('onClick')}
      name='arrow-prev'
    />
  ));