import React from 'react';
import { storiesOf } from '@storybook/react';
import LayoutModal from './index';
import { action } from '@storybook/addon-actions';

storiesOf('layouts/LayoutModal', module)
  .add('Базовая', () => (
    <LayoutModal header={'{header}'} footer={'{footer}'} onClose={action('onClose')}>
      {'{children}'}
    </LayoutModal>
  ))
  .add('Без заголовка', () => <LayoutModal onClose={action('onClose')}>{'{children}'}</LayoutModal>)
  .add('Без кнопки закрытия', () => (
    <LayoutModal toolClose={false} onClose={action('onClose')}>
      {'{children}'}
    </LayoutModal>
  ))
  .add('Прозрачный фон', () => (
    <LayoutModal overflowTransparent={true} onClose={action('onClose')}>
      {'{children}'}
    </LayoutModal>
  ))
  .add('Не закрывать по фону', () => (
    <LayoutModal overflowTransparent={true} overflowClose={false} onClose={action('onClose')}>
      {'{children}'}
    </LayoutModal>
  ));
