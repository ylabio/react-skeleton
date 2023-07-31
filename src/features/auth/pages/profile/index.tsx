import {memo} from 'react';
import useStoreState from "@src/services/store/use-store-state";
import useServices from "@src/services/use-services";
import useInit from "@src/services/use-init";
import {useTranslate} from "@src/services/i18n/use-i18n";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import AuthHead from "@src/features/auth/components/auth-head";
import SideLayout from "@src/ui/layout/side-layout";
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import ProfileCard from "@src/features/auth/components/profile-card";

function ProfilePage() {

  const store = useServices().store;

  useInit(() => {
    store.modules.profile.load();
  }, []);

  const profile = useStoreState('profile');
  const t = useTranslate();

  return (
    <PageLayout>
      <Head title="React Skeleton">
        <SideLayout>
          <AuthHead/>
          <LocaleSelect/>
        </SideLayout>
      </Head>
      <MainMenu/>
      <ProfileCard t={t} data={profile.data || {}}/>
    </PageLayout>
  );
}

export default memo(ProfilePage);
