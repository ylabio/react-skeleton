import {lazy, memo, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import Modals from '@src/features/modals/container';
import Loading from '@src/app/loading';
import Protected from "@src/features/auth/components/protected";

// import Main from '@src/app/main';
// import Login from '@src/app/login';
// import Catalog from '@src/app/catalog';
// import Private from '@src/app/private';
// import NotFound from '@src/app/not-found';

// Динамический импорт станиц
const Main = lazy(() => import('@src/app/main'));
const Login = lazy(() => import('@src/app/login'));
const Catalog = lazy(() => import('@src/app/catalog'));
const Profile = lazy(() => import('@src/app/profile'));
const NotFound = lazy(() => import('@src/app/not-found'));
const ModalsExample = lazy(() => import('@src/app/modals-example'));
const I18nExample = lazy(() => import('@src/app/i18n-example'));

function App() {
  return (
    <>
      <Helmet>
        <html lang="en"/>
        <title>Example</title>
        <meta name="description" content="React skeleton example"/>
      </Helmet>
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/" index element={<Main/>}/>
          <Route path="/modals-example" index element={<ModalsExample/>}/>
          <Route path="/i18n-example" index element={<I18nExample/>}/>
          <Route path="/catalog" element={<Catalog/>}/>
          <Route path="/catalog/:categoryId" element={<Catalog/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Protected redirect="/login"><Profile/></Protected>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
      <Modals/>
    </>
  );
}

export default memo(App);
