import {memo} from 'react';
import Head from "@src/ui/layout/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import Draw from "@src/features/example-canvas/components/draw";

function ExampleCanvasPage() {

  return (
    <PageLayout>
      <Head title="React Skeleton">
        <LocaleSelect/>
      </Head>
      <MainMenu/>
      <Draw/>
    </PageLayout>
  );
}

export default memo(ExampleCanvasPage);
