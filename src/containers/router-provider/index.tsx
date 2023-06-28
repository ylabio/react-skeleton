import React, { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';

/**
 * Провайдер для роутера вместо <BrowserRouter> <MemoryRouter> для использования services.navigation
 * @param navigation
 * @param children
 * @return {JSX.Element}
 */
function RouterProvider({ navigation, children }: { navigation: any, children: React.ReactNode }) {
  const [state, setState] = useState({
    location: navigation.location,
    action: navigation.action,
  });

  // // Подписка на изменение навигации
  useEffect(() => {
    return navigation.listen((newState: any) => {
      setState(newState);
    });
  }, []);

  return (
    <Router
      navigationType={state.action}
      location={state.location}
      basename={navigation.basename}
      navigator={navigation.history}
    >
      {children}
    </Router>
  );
}

export default React.memo(RouterProvider);
