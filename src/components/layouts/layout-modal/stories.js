import React from 'react';
import {storiesOf} from '@storybook/react';
import LayoutModal from './index';
import {action} from '@storybook/addon-actions';


storiesOf('layouts/LayoutModal (модалка)', module)
  .add('Базовая', () => (
    <LayoutModal
      header={"Заголовок"}
      footer={"Подвал"}
      onClose={action('onClose')}>
      Модалка
    </LayoutModal>
  ))
  .add('Без заголовка', () => (
    <LayoutModal
      onClose={action('onClose')}>
      Модалка
    </LayoutModal>
  ))
  .add('Без кнопки закрытия', () => (
    <LayoutModal
      toolClose={false}
      onClose={action('onClose')}>
      Модалка
    </LayoutModal>
  ))
  .add('Прозрачный фон', () => (
    <LayoutModal
      overflowTransparent={true}
      onClose={action('onClose')}>
      Модалка
    </LayoutModal>
  ))
  .add('Не закрывать по фону', () => (
    <LayoutModal
      overflowTransparent={true}
      overflowClose={false}
      onClose={action('onClose')}>
      Модалка
    </LayoutModal>
  ));