import { Navigate } from 'react-router-dom';
import { NavigateSSRProps } from '@src/services/router/types';
import useServices from '@src/services/use-services';

/**
 * Аналог компонента Navigate, но умеющий работать при SSR, чтобы отдать клиенту 301 с Location
 */
export function NavigateSSR ({
  to,
  replace,
  state,
  relative,
  httpStatus = 301,
}: NavigateSSRProps): null {
  if (import.meta.env.SSR) {
    if (typeof to === 'string')
      useServices().router.setHttpStatus(httpStatus, to);
    return null;
  } else {
    return Navigate({ to, replace, state, relative });
  }
}
