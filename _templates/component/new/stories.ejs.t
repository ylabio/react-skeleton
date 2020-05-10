---
to: src/<%= path %>/stories.js
---
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import <%= h.inflection.camelize(name) %> from './index';

storiesOf('elements/<%= h.inflection.camelize(name) %>', module).add(
  'default',
  withInfo()(() => <<%= h.inflection.camelize(name) %> onClick={action('onClick')} theme={'default'} />),
);
