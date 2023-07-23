import {memo, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useTranslate} from "@src/features/i18n/use-i18n";
import useServices from "@src/services/use-services";
import useSelector from "@src/services/store/use-selector";
import SideLayout from "@src/ui/layout/side-layout";

function AuthHead() {
  const t = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const store = useServices().store;

  const select = useSelector(state => ({
    user: state.session.user,
    exists: state.session.exists
  }));

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
    <SideLayout side="end" padding="none">
      {select.user ? <Link to="/profile">{select.user.profile.name}</Link> : ''}
      {select.user
        ? <button onClick={callbacks.onSignOut}>{t('auth.signOut')}</button>
        : <button onClick={callbacks.onSignIn}>{t('auth.signIn')}</button>
      }
    </SideLayout>
  );
}

export default memo(AuthHead);
