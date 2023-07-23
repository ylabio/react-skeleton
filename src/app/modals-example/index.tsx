import {memo, useCallback} from 'react';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import useServices from "@src/services/use-services";
import LocaleSelect from "@src/features/i18n/components/locale-select";
import {useTranslate} from "@src/features/i18n/use-i18n";

interface IProps {
  close?: () => void;
}

function ModalsExamplePage(props: IProps) {
  const t = useTranslate();
  const modals = useServices().modals;

  const callbacks = {
    openMessage: useCallback(async () => {
      modals.open('message', {
        title: 'Сообщение',
        message: 'Простое окно с сообщением. Заголовок и текст переданы при открытии окна'
      });
    }, []),

    openConfirm: useCallback(async () => {
      const result = await modals.open('confirm', {
        title: 'Подтвердите действие!',
        message: 'Вы действительно хотите выполнить некое действие? Ваш выбор отобразится в консоле браузера.'
      });
      console.log('confirm', result);
    }, []),

    openPrompt: useCallback(async () => {
      const result = await modals.open('prompt', {
        title: 'Введите строку',
        message: 'Введенное значение отобразится в консоле браузера, если нажмете Ок.',
      });
      console.log('prompt', result);
    }, []),

    openCascade: useCallback(async () => {
      const result = await modals.open('cascade', {
        title: 'Каскад окон',
        message: 'Откройте ещё одно окно, при этом текущее не будет закрыто'
      });
      console.log('cascade', result);
    }, []),

    openPage: useCallback(async () => {
      modals.open('modalsExample');
    }, []),

    onClose: useCallback(() => {
      if (props.close) props.close();
    }, [props.close])
  };

  return (
    <PageLayout>
      <Head title="React Skeleton">
        {props.close ? <button onClick={callbacks.onClose}>Закрыть</button> : <LocaleSelect/>}
      </Head>
      <MainMenu/>
      <h2>{t('common.modals.title')}</h2>
      <p>
        Модальные окна отображаются поверх текущей страницы, делая её элементы недоступными пока
        окно не закроется.
        Управление модальными окнами осуществляется сервисом modals. Для открытия окна вызывается
        метод open с передачей свойств окна. Свойства окна - это свойства React компонента, которым
        реализовано окно.
        Любой React компонент может стать окном, его достаточно прописать в файле
        `@src/modals/imports.ts`.
        В компонент окна автоматически передаётся функция обратного вызова close, чтобы закрыть окно
        и передать результат.
        Смотрите README в `./src/modals/README.md`
      </p>
      <p>
        <button onClick={callbacks.openMessage}>Сообщение</button>
      </p>
      <p>
        <button onClick={callbacks.openConfirm}>Подтверждение</button>
      </p>
      <p>
        <button onClick={callbacks.openPrompt}>Запрос значения</button>
      </p>
      <p>
        <button onClick={callbacks.openCascade}>Каскад окон</button>
      </p>
      <p>
        Пример отображения страницы в качестве модального окна.
        Страница отобразится ниже, так как позиционируется в соответствии с нормальным потоком
        документа.
        Тогда как в разметке модальных окон используется абсолютная или фиксированная позиция.
      </p>
      <p>
        <button onClick={callbacks.openPage}>Открыть текущую страницу сервисом модалок</button>
      </p>
    </PageLayout>
  );
}

export default memo(ModalsExamplePage);
