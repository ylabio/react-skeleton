# React skeleton

Скелет frontend приложения на React & Vite с рендером на сервере или клиенте.
Открытая структура кода для свободного изменения.

## Новый проект

Новый проект создается форком или клонированием репозитория react-skeleton,
чтобы в дальнейшем свободно модифицировать код под особенности проекта. 

## Требования

- Node.js >= 18

## Установка

`npm install`

## Запуск для разработки

В режиме разработки приложение запускается командой:

`npm start`

или

`npm run start:ssr` С рендером на сервере (SSR)

Конфигурация приложения определяется в файле `src/config.js`. 
По умолчанию определены параметры АПИ, навигации, модулей состояния и других сервисов

Приложение по умолчанию доступно по адресу `http://localhost:8050`.
Порт меняется в файле конфигурации сервера `ssr/config.js` и может отличаться от указанного.

```javascript
server: {
  port: 8050,
}
```

В режиме разработки используется сборщик Vite для отслеживания изменения в коде и последующего 
“горячего” обновления приложения в браузере.

## Сборка

Для публикации проекта на сервере сначала выполняется сборка приложения командой:

`npm run build` - сборка клиентской и серверной части приложения

или

`npm run build:client` - сборка только клиентской части приложения, если не нужен SSR.

Собранные и минимизированные файлы приложения помещаются в папку `/dist`.  [Подробнее](dist/README.md).

На http сервере директория `/dist/client` должны быть публичной. 
Ниже есть пример настройки сервера nginx. 

## SSR

SSR - это рендер приложения на сервере, чтобы клиент по первому запросу получал готовый html. 
В первую очередь для обработки поисковиками. В последнюю для сокращения времени первого отображения.

Проверить production версию можно командой `npm run preview:ssr`. При этом выполнится сборка и 
запуститься сервер приложения. В режиме разработки используйте команду `npm run start:ssr`

Если на внешний сервер переносится уже собранное приложение, то можно на внешнем сервере запускать
команду `node ./ssr/index.js`

Для постоянной работы сервера рендера можно воспользоваться менеджером процессов pm2.

`pm2 start process.json`

На внешний сервер необходимо перенести папки с файлами:
- dist
- node_modules
- ssr

## Nginx

Рекомендуется использовать nginx.

Nginx в режиме **без** рендера должен отдавать только статичные файлы из `./dist/client`, 
и если url не на существующий файл, то отдавать `./dist/client/index.html`.

Пример настройки nginx

```
server {
  listen 80;
  server_name react-skeleton.com;
  location / {
    root /home/user/react-skeleton/dist/web;
    try_files $uri /index.html;
  }
}
```

В режиме рендера (SSR) запускается приложение на node.js `node ./ssr/index.js`
и в nginx проксируются запросы на него для рендера html вместо отдачи index.html.

Можно проксировать все запросы, так приложение само либо выполнит ренлер, либо отдаст файлы из
./dist/client/assets/ Но для оптимизации файлы-ресурсы (картинки, стили...) можно раздавать через nginx.

В nginx можно также настроить прокси к апи, если оно находится на другом хосте.

```
server {
  listen 80;
  server_name react-skeleton.com;
  client_max_body_size 10M;
  
  # # Прокси к АПИ 
  # location /api/ {
  #     proxy_redirect off;
  #     proxy_set_header Host api.react-skeleton.com; 
  #     proxy_set_header X-Real-IP $remote_addr;
  #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  #     proxy_set_header X-Forwarded-Proto $scheme;
  #     proxy_set_header X-Frame-Options SAMEORIGIN;
  #     proxy_pass https://api.react-skeleton.com;
  #  }
  
  # # Запросы к файлам 
  # location ~ \.(js|css|png|pdf|svg|webp|ico|ttf) {
  #   root /var/www/newsite/dist/web/;
  #   try_files $uri $uri/ =404; 
  # }

  # Рендер - проксирование запроса в приложение
  location / {
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Frame-Options SAMEORIGIN;
    proxy_pass http://127.0.0.1:8150;
  }
}
```

## Анализ размера сборки

`npm run build-analize`

[Документация (старая)](https://react-skeleton.ru)
