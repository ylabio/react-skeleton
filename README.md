# Скелет приложения на React

[Документация](https://vladimirshestakov.gitbooks.io/react-guid/content/) по разработке и описание 
струкруры ([github](https://github.com/ylabio/react-guide))

## Установка
`npm install`

## Запуск сервера разработки

`npm start`

[http://localhost:8030](http://localhost:8030/)

## Сборка приложения
`npm run build`

Результат сборки в `./dist` [README](dist/README.md)

## Библиотека компонент

`npm run storybook`

[http://localhost:9030](http://localhost:9030/)

## Анализ размера сборки
`npm run build-analize`

# React Server Side Rendering (SSR)
Особенности и ключевые моменты серверного рендера на React.

## Ключевые файлы
* **index.js** - запуск сервера (node index.js).
* **webpack-isomorphic-tools-config.js** - конфигурация для обработки импортов стилей и картинок для серверного рендера.
* **src/server.js** - скрипт запуска express.js http сервера для обработки входящих запросов и рендера страниц реакта.
* **src/routes.js** - роутинг всего приложения в виде вложенного объекта.
* **src/config.js** - конфигурация http сервера - хост и порт.
* **src/containers/app-server/index.js** - корневой react контейнер для серверного рендера.

## Алгоритм разработки
1. Отредактировать **routes.js** и прописать в нем весь роутинг проекта. Также этот файл можно использовать в компонентах для генерации роутинга.
    ```
    <Router history={this.history}>
      <Switch>
        {objectUtils.objectToArray(routes).map(route => {
          return (
            <Route key={route.path} path={route.path} exact={route.exact} component={route.component}/>
          );
        })}
      </Switch>
    </Router>
    ```
2. В каждом компоненте, где это действительно нужно, добавить статичный метод **initServer({dispatch, params, req})**, в котором прописать вызов всех методов
необходимых для формирования redux store (или state) непосредственно перед рендером компонента. Пример: src/pages/home/index.js.
    ```
    static initServer = ({dispatch, params, req}) => {
      return dispatch(actions.cities.fetchList({country: params.country}));
    };
    ```
3. В каждом компоненте, где необходимо, прописать title и description через **react-helmet**.
Title и Description по умолчанию прописываются в корневом компоненте **src/app-server/index.js**.
    ```
    <Helmet>
      <title>Home Page</title>
      <meta name="description" content="This is a proof of concept for React SSR"/>
    </Helmet>
    ```
## Запуск
1. Development режим: `npm run start-ssr`
2. Production режим: `npm run build-ssr`

Перед запуском http сервера на node.js происходит сборка клиентского react приложения в папку `./dist`,
чтобы сервер потом смог отдать вместе с html версткой `main.js` скрипт.
