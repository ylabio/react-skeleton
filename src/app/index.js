import React, {Fragment, useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {Helmet} from "react-helmet";
import * as actions from "@store/actions";
import Private from "@app/private";
import Login from "@app/login";
import Main from "@app/main";
import NotFound from "@app/not-found";
import About from "@app/about";
import Modals from "@app/modals";
import useSelectorMap from "@utils/use-selector-map";
import Catalog from "@app/catalog";
import useActions from "@utils/use-actions";

const App = React.memo((props) => {

  const select = useSelectorMap(state => ({
    session: state.session,
    user: state.user
  }));

  useEffect(()=>{
    actions.session.remind();
  },[]);

  if (select.session.wait) {
    return <Fragment><span>Загрузка...</span></Fragment>;
  }
  return (
    <Fragment>
      <Helmet>
        <title>Example</title>
      </Helmet>
      <Switch>
        <Route path="/" exact={true} component={Main}/>
        <Route path="/catalog/:categoryId?" component={Catalog}/>
        <Route path="/about" component={About}/>
        <Route path="/login" component={Login}/>
        <Route path="/private" component={Private}/>
        <Route component={NotFound}/>
      </Switch>
      <Modals/>
    </Fragment>
  );
});


export default App;
