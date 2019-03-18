import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Icon from './index';

const sizeProps = { height: '30px', width: '30px' };

storiesOf('elements/Icon-New', module)
  .add('fb', () => <Icon name="fb" onClick={action('onClick')} {...sizeProps} />)
  .add('ok', () => <Icon name="ok" onClick={action('onClick')} {...sizeProps} />)
  .add('twitter', () => <Icon name="twitter" onClick={action('onClick')} {...sizeProps} />)
  .add('vk', () => <Icon name="vk" onClick={action('onClick')} {...sizeProps} />)
  .add('menu', () => <Icon name="menu" onClick={action('onClick')} {...sizeProps} />)
  .add('arrow', () => <Icon name="arrow" onClick={action('onClick')} {...sizeProps} />);
