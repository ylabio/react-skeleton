import {memo, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslate} from "@src/services/i18n/use-i18n";
import useServices from "@src/services/use-services";
import SideLayout from "@src/ui/layout/side-layout";
import useStoreState from "@src/services/store/use-store-state";

function AuthHead() {
  const t = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const store = useServices().store;
  const session = useStoreState('session');

  const callbacks = {
    // Переход к авторизации
    onSignIn: useCallback(() => {
      navigate('/login', {state: {back: location.pathname}});
    }, [location.pathname]),

    // Отмена авторизации
    onSignOut: useCallback(() => {
      store.modules.session.signOut();
    }, []),
  };

  return (
    <SideLayout side="end">
      {session.user ? <Link to="/profile">{session.user.profile.name}</Link> : ''}
      {session.user
        ? <button onClick={callbacks.onSignOut}>{t('auth.signOut')}</button>
        : <button onClick={callbacks.onSignIn}>{t('auth.signIn')}</button>
      }
    </SideLayout>
  );
}

export default memo(AuthHead);
