import {memo, ReactNode, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useServices from "@src/services/use-services";
import useInit from "@src/services/use-init";
import useStoreState from "@src/services/store/use-store-state";

interface Props {
  children: ReactNode,
  redirect: string
}

function Protected({children, redirect}: Props) {

  const navigate = useNavigate();
  const location = useLocation();
  const services = useServices();
  const session = useStoreState('session');

  useInit(async () => {
    // Вызывается даже если есть сессиия в целях её акутализации
    // Вызов происходит при переходе в роут с друго пути
    await services.store.modules.session.remind();
  });

  useEffect(() => {
    if (!session.user && !session.waiting) {
      navigate(redirect, {state: { back: location.pathname }});
    }
  }, [session.user, session.waiting]);

  if (!session.user || session.waiting){
    return <div>Ждём...</div>;
  } else {
    return children;
  }
}

export default memo(Protected);
