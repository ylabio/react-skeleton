import Home from './containers/pages/home';
import About from './containers/pages/about';
import Login from './containers/pages/login';
import Main from './containers/pages/main';
import Page1 from './containers/pages/main/page1';
import NotFound from './containers/pages/not-found';

export default {
  home: {path: '/', component: Home, exact: true},
  about: {path: '/about', component: About, exact: true},
  login: {path: '/login', component: Login, exact: true},
  main: {
    path: '/main', component: Main, exact: true, children: {
      page1: {path: '/main', component: Page1, exact: true},
      page2: {path: '/main/page2', component: Page1, exact: true},
      notFound: {path: '', component: NotFound, exact: false},
    }
  },
  notFound: {path: '', component: NotFound, exact: false},
};
