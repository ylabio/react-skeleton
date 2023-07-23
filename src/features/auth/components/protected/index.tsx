import {memo, ReactNode, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useSelector from "@src/services/store/use-selector";
import useServices from "@src/services/use-services";
import useInit from "@src/services/use-init";

interface Props {
  children: ReactNode,
  redirect: string
}

function Protected({children, redirect}: Props) {

  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const services = useServices();

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
