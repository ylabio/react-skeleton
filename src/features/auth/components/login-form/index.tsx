import useSelector from "@src/services/store/use-selector";
import {FormEvent, memo, useCallback, useState} from "react";
import {useTranslate} from "@src/services/i18n/use-i18n";
import {useLocation, useNavigate} from "react-router-dom";
import useServices from "@src/services/use-services";
import Field from "@src/ui/elements/field";
import Input from "@src/ui/elements/input";
import {SignInBody} from "@src/features/auth/api/types";

function LoginForm() {

  const t = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const store = useServices().store;

  const select = useSelector(state => ({
    waiting: state.session.waiting,
    errors: state.session.errors
  }));

  const [data, setData] = useState<SignInBody>({
    login: '',
    password: '',
    remember: true
  });

  const callbacks = {
    // Колбэк на ввод в элементах формы
    onChange: useCallback((value: string, name: string) => {
      setData(prevData => ({...prevData, [name]: value}));
    }, []),

    // Отправка данных формы для авторизации
    onSubmit: useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      store.modules.session.signIn(data).then(success => {
        if (success) {
          // Возврат на страницу, с которой пришли
          const back = location.state?.back && location.state?.back !== location.pathname
            ? location.state?.back
            : '/';
          navigate(back);
        }
      });
    }, [data, location.state])
  };

  return (
    <form onSubmit={callbacks.onSubmit}>
      <h2>{t('auth.loginForm.title')}</h2>
      <Field label={t('auth.loginForm.login')} error={select.errors?.login}>
        <Input name="login" value={data.login} onChange={callbacks.onChange}/>
      </Field>
      <Field label={t('auth.loginForm.password')} error={select.errors?.password}>
        <Input name="password" type="password" value={data.password} onChange={callbacks.onChange}/>
      </Field>
      <Field error={select.errors?.other}/>
      <Field>
        <button type="submit">{t('auth.signIn')}</button>
      </Field>
    </form>
  );
}

export default memo(LoginForm);
