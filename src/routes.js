import Home from './containers/pages/home';
import About from './containers/pages/about';
import Login from './containers/pages/login';
import Main from './containers/pages/main';
import NotFound from './containers/pages/not-found';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/about',
    component: About,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/main',
    component: Main,
    exact: true,
  },
  {
    path: '',
    component: NotFound,
    exact: false,
  },
];
