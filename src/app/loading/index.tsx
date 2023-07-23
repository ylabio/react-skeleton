import {memo} from 'react';
import Head from "@src/ui/navigation/head";
import PageLayout from "@src/ui/layout/page-layout";

/**
 * Страница в режиме ожидания загрузки
 * Не должна содержать контейнеры с асинхронной загрузкой (ожидания данных)
 * При этом должна повторять разметку (относительное расположение постоянных элементов),
 * чтобы вёрстка не прыгала
 */
function Loading() {
  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <p>Загрузка...</p>
    </PageLayout>
  );
}

export default memo(Loading);
