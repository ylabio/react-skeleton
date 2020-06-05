# Скелет приложения на React

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


## Code generator

Для автоматического создания типовых файлов
можно использовать [hygen.io](http://www.hygen.io/)

```
npm i -g hygen

hygen component help
hygen component new --name Pizza --path components/elements/pizza
hygen component store pizzas
hygen component api pizzas
```

Шаблоны и пути к файлам можно редактировать в папке `_templates`

